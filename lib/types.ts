export type Framework = "Playwright" | "Cypress" | "Selenium";
export type Language = "JavaScript" | "Python" | "Java" | "C#";

export type InteractiveElement = {
  tag: string;
  selector: string;
  text?: string;
  type?: string;
  name?: string;
  label?: string;
  href?: string;
  placeholder?: string;
  options?: string[];
};

export type FormElement = {
  selector: string;
  action?: string;
  method?: string;
  fields: string[];
  submitButtons: string[];
};

export type ModalElement = {
  selector: string;
  title?: string;
  description?: string;
};

export type DomScanResult = {
  url: string;
  pageTitle: string;
  buttons: InteractiveElement[];
  inputs: InteractiveElement[];
  forms: FormElement[];
  links: InteractiveElement[];
  checkboxes: InteractiveElement[];
  radios: InteractiveElement[];
  selects: InteractiveElement[];
  navigation: InteractiveElement[];
  modals: ModalElement[];
};

export type TestGeneration = {
  id: string;
  user_id: string;
  url: string;
  framework: Framework;
  language: Language;
  generated_code: string;
  created_at: string;
};

export type GenerateResponse = {
  id: string;
  code: string;
};
