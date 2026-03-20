export default {
  system: 'swn',
  characterName: '',
  background: '',
  class: '',
  level: 1,
  xp: 0,
  homeworld: '',
  employer: '',
  species: '',
  
  attributes: [
    { name: 'STR', score: 10 },
    { name: 'DEX', score: 10 },
    { name: 'CON', score: 10 },
    { name: 'INT', score: 10 },
    { name: 'WIS', score: 10 },
    { name: 'CHA', score: 10 },
  ],
  
  saves: {
    physical: 15,
    evasion: 15,
    mental: 15,
  },
  
  skills: [
    { name: 'Administer', level: -1 },
    { name: 'Connect', level: -1 },
    { name: 'Exert', level: -1 },
    { name: 'Fix', level: -1 },
    { name: 'Heal', level: -1 },
    { name: 'Know', level: -1 },
    { name: 'Lead', level: -1 },
    { name: 'Notice', level: -1 },
    { name: 'Perform', level: -1 },
    { name: 'Pilot', level: -1 },
    { name: 'Program', level: -1 },
    { name: 'Punch', level: -1 },
    { name: 'Shoot', level: -1 },
    { name: 'Sneak', level: -1 },
    { name: 'Stab', level: -1 },
    { name: 'Survive', level: -1 },
    { name: 'Talk', level: -1 },
    { name: 'Trade', level: -1 },
    { name: 'Work', level: -1 },
    // Psionic Skills
    { name: 'Biopsionics', level: -1 },
    { name: 'Metapsionics', level: -1 },
    { name: 'Precognition', level: -1 },
    { name: 'Telekinesis', level: -1 },
    { name: 'Telepathy', level: -1 },
    { name: 'Teleportation', level: -1 },
  ],
  
  hp: 0,
  maxHp: 0,
  systemStrain: 0,
  permanentSystemStrain: 0,
  baseAttackBonus: 0,
  skillPoints: 0,
  
  weapons: [
    { name: '', rangeAmmo: '', atkBonus: '', damage: '', mods: '' },
    { name: '', rangeAmmo: '', atkBonus: '', damage: '', mods: '' },
    { name: '', rangeAmmo: '', atkBonus: '', damage: '', mods: '' },
    { name: '', rangeAmmo: '', atkBonus: '', damage: '', mods: '' },
  ],
  armor: [
    { name: '', ac: '', mods: '' },
    { name: '', ac: '', mods: '' },
  ],
  
  foci: {}, // Quill Delta
  cybernetics: {}, // Quill Delta
  psionicTechniques: {}, // Quill Delta
  psionicEffort: { current: 0, max: 0 },
  
  readiedItems: {}, // Quill Delta
  stowedEquipment: {}, // Quill Delta
  nonEncumberingEquipment: {}, // Quill Delta
  equipmentInStorage: {}, // Quill Delta
  
  credits: 0,
  debts: 0,
  
  assets: {}, // Quill Delta
  languagesKnown: {}, // Quill Delta
  contacts: {}, // Quill Delta
  aliases: {}, // Quill Delta
  
  notesText: {}, // Quill Delta
  goalsText: {}, // Quill Delta
  achievementsText: {}, // Quill Delta
  
  vehicleDetails: {}, // Quill Delta
  starshipDetails: {}, // Quill Delta
};
