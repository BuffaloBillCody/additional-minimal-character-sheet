export default {
  system: 'wwn',
  characterName: '',
  player: '',
  homeland: '',
  occupation: '',
  species: '',
  goal: '',
  descriptionText: {}, // Quill Delta
  backgroundText: {}, // Quill Delta
  class: '',
  classBenefitsText: {}, // Quill Delta
  
  level: 1,
  xp: 0,
  
  attributes: [
    { name: 'STR', score: 10 },
    { name: 'DEX', score: 10 },
    { name: 'CON', score: 10 },
    { name: 'INT', score: 10 },
    { name: 'WIS', score: 10 },
    { name: 'CHA', score: 10 },
  ],
  
  hp: 0,
  maxHp: 0,
  systemStrain: 0,
  maxSystemStrain: 0,
  
  saves: {
    physical: 15,
    evasion: 15,
    mental: 15,
    luck: 15,
  },
  
  baseAttackBonus: 0,
  meleeAttackBonus: 0,
  rangedAttackBonus: 0,
  initiativeBonus: 0,
  
  armorClass: 10,
  armorName: '',
  armorSpecial: '',
  armor: [
    { name: '', ac: '', mods: '' },
    { name: '', ac: '', mods: '' },
  ],

  weapons: [    { name: '', bonusToHit: '', damage: '', range: '', specialShock: '' },
    { name: '', bonusToHit: '', damage: '', range: '', specialShock: '' },
    { name: '', bonusToHit: '', damage: '', range: '', specialShock: '' },
    { name: '', bonusToHit: '', damage: '', range: '', specialShock: '' },
  ],
  ammunitionText: {}, // Quill Delta
  
  skills: [
    { name: 'Administer', level: -1 },
    { name: 'Connect', level: -1 },
    { name: 'Convince', level: -1 },
    { name: 'Craft', level: -1 },
    { name: 'Exert', level: -1 },
    { name: 'Heal', level: -1 },
    { name: 'Know', level: -1 },
    { name: 'Lead', level: -1 },
    { name: 'Magic', level: -1 },
    { name: 'Notice', level: -1 },
    { name: 'Perform', level: -1 },
    { name: 'Pray', level: -1 },
    { name: 'Punch', level: -1 },
    { name: 'Ride', level: -1 },
    { name: 'Sail', level: -1 },
    { name: 'Shoot', level: -1 },
    { name: 'Sneak', level: -1 },
    { name: 'Stab', level: -1 },
    { name: 'Survive', level: -1 },
    { name: 'Trade', level: -1 },
    { name: 'Work', level: -1 },
  ],
  skillPoints: 0,
  
  sketchOrSigil: '', // could be image URL or just notes for now
  
  readiedItems: {}, // Quill Delta
  stowedItems: {}, // Quill Delta
  storedItems: {}, // Quill Delta
  
  foci: {}, // Quill Delta
  magicalArts: {}, // Quill Delta
  currentEffort: 0,
  maxEffort: 0,
  highMagic: {}, // Quill Delta
  
  mountDetails: {}, // Quill Delta
  projects: {}, // Quill Delta
  renown: 0,
  
  wealth: { gp: 0, sp: 0, cp: 0, other: '' },
  
  alliesAndEnemies: {}, // Quill Delta
  languages: {}, // Quill Delta
  notesText: {}, // Quill Delta
  goalsText: {}, // Quill Delta
};
