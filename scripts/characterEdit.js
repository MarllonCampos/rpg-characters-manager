class CharacterEdit {
  constructor(props) {
    this.characterUI = new CharacterUI();
    this.localStorageKey = CharacterEdit.#localStorageKey;
    if (props?.id) {
      this.character = props;
    } else this.character = { ...props, id: this.randomUUID() };
  }

  randomUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  }
  static get #localStorageKey() {
    return 'x-all-characters';
  }

  get name() {
    return this.character.name;
  }

  get id() {
    return this.character.id;
  }

  get type() {
    return this.character.type;
  }

  get maxHp() {
    return this.character.attributes.maxHp;
  }

  get hp() {
    return this.character.attributes.hp;
  }

  get maxAp() {
    return this.character.attributes.maxap;
  }

  get ap() {
    return this.character.attributes.ap;
  }

  get maxSanity() {
    return this.character.attributes.maxsanity;
  }

  get sanity() {
    return this.character.attributes.sanity;
  }

  get attributes() {
    return this.character.attributes;
  }

  create() {
    const allCharacters = CharacterEdit.getCharacters();
    allCharacters.push(this.character);

    this.saveCharacters(allCharacters);
  }

  saveCharacters(allCharacters) {
    if (!Array.isArray(allCharacters)) return;
    window.localStorage.setItem(CharacterEdit.#localStorageKey, JSON.stringify(allCharacters));
  }

  indexOfObject() {
    const allCharacters = CharacterEdit.getCharacters();
    return allCharacters.findIndex((typeCharacter) => String(typeCharacter.id) === String(this.character.id));
  }

  changePosition(number) {
    const formattedNumber = Number(number);
    const allCharacters = CharacterEdit.getCharacters();
    const indexOfCharacter = this.indexOfObject(this.character);
    const nextCharacterIndex = indexOfCharacter + formattedNumber;
    const grandeur = number < 0 ? 'Maior' : 'Menor';
    if (nextCharacterIndex + 1 > allCharacters.length || nextCharacterIndex < 0)
      return alert(`${grandeur} indice possível`);
    const previousCharacter = allCharacters[nextCharacterIndex];
    allCharacters[nextCharacterIndex] = this.character;
    allCharacters[indexOfCharacter] = previousCharacter;
    this.saveCharacters(allCharacters);
    this.characterUI.list();
  }

  changeAttribute({ attribute, value }) {
    const allCharacters = CharacterEdit.getCharacters();

    const nonMaxAttribute = attribute.replace('max', '').toLowerCase();
    const isMaxAttribute = /max/gi.test(attribute);
    const maxAttribute = isMaxAttribute ? attribute : `max${attribute}`;

    const character = allCharacters.find((character) => character.id == this.character.id);
    const characterIndex = this.indexOfObject(character);
    const characterAttributeValue = Number(this.character.attributes[nonMaxAttribute]);
    const maxCharacterAttributeValue = Number(this.character.attributes[maxAttribute]);
    const newAttributeValue = String(characterAttributeValue + Number(value));
    const increaseMaxAttribute = newAttributeValue > maxCharacterAttributeValue;
    const specificAttributeButton = Array.from(document.querySelectorAll(`button[data-attribute=${nonMaxAttribute}]`))[
      characterIndex
    ];
    const maxAttributeButton = Array.from(document.querySelectorAll(`button[data-attribute=${maxAttribute}]`))[
      characterIndex
    ];

    function changeButtonValues(element, value) {
      element.value = value;
      element.innerHTML = value;
    }
    let newCharacter = { ...this.character };
    if (!isMaxAttribute) {
      changeButtonValues(specificAttributeButton, newAttributeValue);
      newCharacter.attributes[attribute] = newAttributeValue;
    }
    if (increaseMaxAttribute) {
      changeButtonValues(maxAttributeButton, newAttributeValue);
      changeButtonValues(specificAttributeButton, newAttributeValue);
      newCharacter.attributes[attribute] = newAttributeValue;
      newCharacter.attributes[nonMaxAttribute] = newAttributeValue;
    }
    if (!increaseMaxAttribute) {
      changeButtonValues(specificAttributeButton, newAttributeValue);
      newCharacter.attributes[nonMaxAttribute] = newAttributeValue;
    }
    allCharacters[characterIndex] = newCharacter;
    this.saveCharacters(allCharacters);
  }

  delete() {
    const allCharacters = CharacterEdit.getCharacters();
    const finalList = allCharacters.filter((characters) => characters.id != this.character.id);
    this.saveCharacters(finalList);
  }

  static getCharacters() {
    const allCharacters = window.localStorage.getItem(CharacterEdit.#localStorageKey);
    return !allCharacters ? [] : JSON.parse(allCharacters);
  }
}
