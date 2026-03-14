import { load, type CheerioAPI } from "cheerio";
import type { AnyNode, Element } from "domhandler";

import type { DomScanResult, FormElement, InteractiveElement, ModalElement } from "@/lib/types";

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() || undefined;
}

function buildSelector($: CheerioAPI, nodeLike: AnyNode) {
  const element = nodeLike as Element;
  const node = $(element);
  const tag = element.tagName.toLowerCase();
  const id = node.attr("id");

  if (id) {
    return `#${id}`;
  }

  const testId = node.attr("data-testid") || node.attr("data-test");
  if (testId) {
    return `[data-testid="${testId}"]`;
  }

  const name = node.attr("name");
  if (name) {
    return `${tag}[name="${name}"]`;
  }

  const ariaLabel = node.attr("aria-label");
  if (ariaLabel) {
    return `${tag}[aria-label="${ariaLabel}"]`;
  }

  const href = node.attr("href");
  if (href && tag === "a") {
    return `a[href="${href}"]`;
  }

  const classNames = (node.attr("class") || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (classNames.length > 0) {
    return `${tag}.${classNames.join(".")}`;
  }

  const siblings = node.parent().children(tag);
  const index = siblings.index(node) + 1;

  return `${tag}:nth-of-type(${Math.max(index, 1)})`;
}

function extractLabel($: CheerioAPI, nodeLike: AnyNode) {
  const element = nodeLike as Element;
  const node = $(element);
  const id = node.attr("id");

  if (id) {
    const explicitLabel = cleanText($(`label[for="${id}"]`).first().text());
    if (explicitLabel) {
      return explicitLabel;
    }
  }

  const wrappedLabel = cleanText(node.closest("label").text());
  if (wrappedLabel) {
    return wrappedLabel;
  }

  return cleanText(node.attr("aria-label")) || cleanText(node.attr("placeholder"));
}

function collectElements(
  $: CheerioAPI,
  selector: string,
  mapper: (element: AnyNode) => InteractiveElement | null
) {
  const seen = new Set<string>();
  const items: InteractiveElement[] = [];

  $(selector).each((_, element) => {
    const result = mapper(element);
    if (!result || seen.has(result.selector)) {
      return;
    }

    seen.add(result.selector);
    items.push(result);
  });

  return items;
}

export function parseDom(html: string, url: string): DomScanResult {
  const $ = load(html);

  const buttons = collectElements(
    $,
    'button, input[type="button"], input[type="submit"], [role="button"]',
    (element) => {
      const domElement = element as Element;
      const node = $(element);
      return {
        tag: domElement.tagName,
        selector: buildSelector($, element),
        text:
          cleanText(node.text()) ||
          cleanText(node.attr("value")) ||
          cleanText(node.attr("aria-label")),
        type: node.attr("type") || undefined
      };
    }
  );

  const inputs = collectElements(
    $,
    'input:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea',
    (element) => {
      const domElement = element as Element;
      const node = $(element);
      return {
        tag: domElement.tagName,
        selector: buildSelector($, element),
        type: node.attr("type") || domElement.tagName,
        name: node.attr("name") || undefined,
        placeholder: cleanText(node.attr("placeholder")),
        label: extractLabel($, element)
      };
    }
  );

  const checkboxes = collectElements($, 'input[type="checkbox"]', (element) => {
    const domElement = element as Element;
    const node = $(element);
    return {
      tag: domElement.tagName,
      selector: buildSelector($, element),
      type: "checkbox",
      name: node.attr("name") || undefined,
      label: extractLabel($, element)
    };
  });

  const radios = collectElements($, 'input[type="radio"]', (element) => {
    const domElement = element as Element;
    const node = $(element);
    return {
      tag: domElement.tagName,
      selector: buildSelector($, element),
      type: "radio",
      name: node.attr("name") || undefined,
      label: extractLabel($, element)
    };
  });

  const selects = collectElements($, "select", (element) => {
    const domElement = element as Element;
    const node = $(element);
    return {
      tag: domElement.tagName,
      selector: buildSelector($, element),
      name: node.attr("name") || undefined,
      label: extractLabel($, element),
      options: node
        .find("option")
        .slice(0, 8)
        .map((_, option) => cleanText($(option).text()) || "")
        .get()
        .filter(Boolean)
    };
  });

  const links = collectElements($, "a[href]", (element) => {
    const domElement = element as Element;
    const node = $(element);
    return {
      tag: domElement.tagName,
      selector: buildSelector($, element),
      text: cleanText(node.text()) || cleanText(node.attr("aria-label")),
      href: node.attr("href") || undefined
    };
  });

  const navigation = collectElements(
    $,
    'nav a, [role="navigation"] a, header a, [data-nav] a',
    (element) => {
      const domElement = element as Element;
      const node = $(element);
      return {
        tag: domElement.tagName,
        selector: buildSelector($, element),
        text: cleanText(node.text()) || cleanText(node.attr("aria-label")),
        href: node.attr("href") || undefined
      };
    }
  );

  const forms: FormElement[] = $("form")
    .map((_, element) => {
      const node = $(element);
      return {
        selector: buildSelector($, element),
        action: node.attr("action") || undefined,
        method: node.attr("method") || "get",
        fields: node
          .find("input, textarea, select")
          .map((__, field) => buildSelector($, field))
          .get(),
        submitButtons: node
          .find('button[type="submit"], input[type="submit"], button:not([type])')
          .map((__, button) => buildSelector($, button))
          .get()
      };
    })
    .get();

  const modals: ModalElement[] = $(
    '[role="dialog"], [aria-modal="true"], .modal, .dialog, [data-modal]'
  )
    .map((_, element) => {
      const node = $(element);
      return {
        selector: buildSelector($, element),
        title:
          cleanText(node.find("h1, h2, h3, [data-title]").first().text()) ||
          cleanText(node.attr("aria-label")),
        description: cleanText(node.find("p").first().text())
      };
    })
    .get();

  return {
    url,
    pageTitle: cleanText($("title").first().text()) || "Untitled page",
    buttons,
    inputs,
    forms,
    links,
    checkboxes,
    radios,
    selects,
    navigation,
    modals
  };
}

export async function scanUrl(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; AutoTestGenAI/1.0; +https://example.com)"
    },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch page HTML. Received ${response.status}.`);
  }

  const html = await response.text();
  return parseDom(html, url);
}
