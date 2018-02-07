interface DisputeToolInformationCollectionConfiguration {
  /**
   * Gives this tool a default dispute process (phone, in person, letter)
   * to be selected automatically. If this is not defined then the user
   * will be prompted
   */
  disputeProcess?: 1 | 2 | 3;

  /** The text that displays after the information forms have been completed */
  nowWhat: string;

  /**
   * The keys for the options object are expected to be
   * 'none' when there is a single option, or else a
   * single capital letter of the latin alphabet, following
   * the English alphabet's order, i.e.:
   *
   * <pre><code>
   *   { none: TheOnlyOption }
   * </code></pre>
   *
   * or
   *
   * <pre><code>
   *   {
   *     A: TheFirstOption,
   *     B: TheSecondOption,
   *     C: TheThirdOption,
   *     ...
   *   }
   * </code></pre>
   */
  options: {
    [optionKey: DisputeToolOptionKey]: DisputeToolInformationCollectionOption;
  };
}

/**
 * This really includes the full alphabet, but since
 * these types aren't used for checking anything it'll be okay
 */
type DisputeToolOptionKey = 'none' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

interface DisputeToolInformationCollectionOption {
  /** The name of the option */
  title: string;

  /**
   * A description of the option's purpose and useful information
   * about the required forms and supporting documents
   */
  description: string;

  /**
   *
   */
  steps: DisputeToolInformationCollectionStep[];
}

type MimeType = 'image/jpeg' | 'image/png' | 'application/pdf';

interface DisputeToolInformationCollectionStep {
  /**
   * upload - Lets the user upload a file
   * form - Asks the user to fill out a form
   * information - Lets the user know some useful information;
   *   usually used to inform them of a second letter that will be
   *   generated for them using the previously collected information
   */
  type: 'upload' | 'form' | 'information';
  /**
   * Name of the step as saved in the DisputeTools data
   * column in the database. This is the name we use when
   * accessing this data in the rendering pipeline
   */
  name: string;
  /** Whether the step is optional, defaults to false */
  optional: boolean = false;
  /** The title that appears at the top of the step */
  title: string;
  /** A short description of the step */
  description: string;
}

interface FormStep extends DisputeToolInformationCollectionStep {
  fieldSets: FieldSet[];
}

class Field {
  /** Instance of the FieldValidation enum defined in validations.js */
  validations: FieldValidation;
  /** Should not contain the required attribute; use the required option below instead */
  attributes: { [x: HTMLAttributeKey]: HTMLAttributeValue } = {};
  /** Whether the field is required, defaulting to true */
  required: boolean = true;

  /** The label which will appear above the rendered form control */
  label: string;
  /** A title for the form control, useful for delineating groups. Renders bigger than a label */
  title?: string;
  /** The name of the form control against which its data will be saved */
  name: string;
  /**
   * BassCSS column class name:
   * http://basscss.com/#responsive-grid
   *
   * Required when multiple fields co-exist on the same row
   */
  columnClassName?: string;
  /** For dropdown type elements, the selectable values */
  options?: (string | number)[];
  /**
   * The type of the form element. This does not get assigned
   * to the form control's HTML element but is used to determine
   * which form control to render. The form control's type, if the
   * one provided by the enum needs to be overwritten, should be set
   * on the attributes object.
   *
   * dropdown - does what you'd expect, makes a <select> with <option>s
   * yesno - Creates a yes or no radio button
   * group - Allows you to pass more fields that will appear under the title passed in for this field
   * checkbox - Must be part of a fields array inside a field where type == 'group'
   *      Will render the control as a checkbox in a series of checkbox options
   */
  type?: 'dropdown' | 'yesno' | 'group' | 'checkbox';

  /**
   * When true and type == 'group' this allows us to
   * selectively activate the field group based on the answer
   * to the yes or no question posed by the label. e.g.:
   *
   *   Are you applying for this discharge as the parent?
   *      When yes, the student's information is requested
   *      When no, we assume the previous information is the students
   */
  yesno?: boolean;

  /** Default value for when yesno == true */
  default?: 'no' | 'yes';

  /**
   * Will be rendered under the title when the answer to a yesno is yes.
   * Useful for giving more details about the extra fields that pop up
   * when there are new requirements based on the answer
   */
  subtitle?: string;

  /** Only used when type == 'group'; the fields in the group */
  fields?: Field[];

  /**
   * Used only when `type == 'yesno'`. When 'Yes' is selected,
   * the message specified by the yes key will be rendered; Same
   * for 'No', then the message in the no key will be rendered.
   */
  alert?: {
    yes?: FieldAlert;
    no?: FieldAlert;
  };
}

interface FieldAlert {
  message: string;
}

type FieldRow = Field[];

interface FieldSet {
  title: string;
  /**
   * An array of FieldRows which themselves
   * contain the fields for that row. If only
   * one field exists in each row then it will
   * span the width of the form, otherwise it
   * is necessary to pass `columnClassName`
   * to the Field constructor
   */
  fields: FieldRow[];
}

interface UploadStep extends DisputeToolInformationCollectionStep {
  /** Allow multiple files */
  multiple: boolean;
  /** Allowed mime types */
  mimeTypes: MimeType[];
  /** The maximum file size in bits */
  maxFileSize: number;
  /** Text for the button that opens the file explorer */
  uploadButtonText: string;
  /** A helpful note below the button */
  footerNotes: string;
}
