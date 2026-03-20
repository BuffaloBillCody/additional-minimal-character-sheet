import Vue from 'vue';
import Vuex from 'vuex';
import { getSystemDefaultState } from './systems';
import { getDnd5eModifier, getSwnModifier } from './utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    id: '',
    slug: '',
    system: 'dnd5e_2014',
    is_2024: false,
    readOnly: false,
    characterName: '',
  },

  getters: {
    modifiers(state) {
      const isSwnWwn = state.system === 'swn' || state.system === 'wwn';
      const abilities = isSwnWwn ? state.attributes : state.abilities;
      const getMod = isSwnWwn ? getSwnModifier : getDnd5eModifier;

      if (!abilities) return [];
      return abilities.map((a) => {
        return {
          ability: a.name,
          val: getMod(a.score),
        };
      });
    },

    proficiencyBonus(state) {
      if (state.proficiencyOverride !== null && state.proficiencyOverride !== undefined) {
        return state.proficiencyOverride;
      }
      if (!state.levelData || !state.level) return 2;
      var level = state.level;
      var row = state.levelData.find((data) => level === data.lvl);
      if (!row) return 2;
      return row.proficiency;
    },
  },

  mutations: {
    replaceState(state, payload) {
      if (!payload.state) return;
      if (typeof payload.state !== 'object') return;
      // Clear existing state keys that might not be in the new state
      Object.keys(state).forEach(key => {
        if (!['id', 'slug', 'system', 'is_2024', 'readOnly', 'characterName'].includes(key)) {
          Vue.delete(state, key);
        }
      });
      for (let prop in payload.state) {
        if (!payload.state.hasOwnProperty(prop)) continue;
        Vue.set(state, prop, payload.state[prop]);
      }
    },

    updateAbilityScore(state, payload) {
      state.abilities.forEach((ability, i) => {
        if (ability.name === payload.name) {
          Vue.set(state.abilities[i], 'score', payload.score);
        }
      });
    },

    updateLevel(state, payload) {
      state.level = payload.level;
    },

    updateBio(state, payload) {
      var allowedFields = [
        'characterName',
        'race',
        'background',
        'className',
        'xp',
        'alignment',
      ];
      var field = payload.field;
      if (!allowedFields.includes(field)) return;
      if (!state.hasOwnProperty(field)) return;
      state[field] = payload.val;
    },

    updateVitals(state, payload) {
      var allowedFields = [
        'hp',
        'maxHp',
        'tempHp',
        'hitDie',
        'totalHitDie',
        'ac',
        'speed',
        'conditions',
        'concentration',
      ];
      var field = payload.field;
      if (!allowedFields.includes(field)) return;
      if (!state.hasOwnProperty(field)) return;
      state[field] = payload.val;
    },

    updateDeathSaves(state, payload) {
      var key = payload.key; // 'successes' or 'failures'
      var i = payload.i; // 0, 1, 2
      var val = payload.val; // boolean
      var deathSaves = { ...state.deathSaves };
      deathSaves[key][i] = val;
      state.deathSaves = deathSaves;
    },

    updateInitiative(state, payload) {
      state.initiative = payload;
    },

    updateInspiration(state, payload) {
      state.inspiration = payload;
    },

    updateShortRests(state, payload) {
      state.shortRests = payload;
    },

    updateProficiencyOverride(state, payload) {
      state.proficiencyOverride = payload;
    },

    updateSkillProficiency(state, payload) {
      if (payload.i >= state.skills.links) return;
      Vue.set(state.skills[payload.i], 'proficient', payload.proficient);
      Vue.set(
        state.skills[payload.i],
        'doubleProficient',
        payload.doubleProficient,
      );
    },

    updateSkillModifierOverride(state, payload) {
      var skill = state.skills.find(
        (skill) => skill.name === payload.skillName,
      );
      if (!skill) return;

      state.skills = state.skills.map((skill) => {
        if (skill.name === payload.skillName) {
          console.log('setting modifier override', payload.modifierOverride);
          skill.modifierOverride = payload.modifierOverride;
        }
        return skill;
      });
    },

    updateSavingThrow(state, payload) {
      var i = state.savingThrows.findIndex(
        (savingThrow) => payload.name === savingThrow.name,
      );
      Vue.set(state.savingThrows[i], 'proficient', payload.proficient);
    },

    updateAttacks(state, payload) {
      var attack = state.attacks.find((attack) => attack.id === payload.id);
      if (!attack) return;

      state.attacks = state.attacks.map((a) => {
        if (a.id === payload.id) {
          a[payload.field] = payload.val;
        }
        return a;
      });
    },

    addAttack(state, payload) {
      var attack = {
        id: Date.now(),
        name: '',
        attackBonus: 0,
        damage: '',
        weaponNotes: '',
      };
      state.attacks.push(attack);
    },

    deleteAttack(state, payload) {
      state.attacks = state.attacks.filter((a) => a.id !== payload.id);
    },

    addListItem(state, payload) {
      if (state[payload.list]) {
        state[payload.list].push(payload.item);
      }
    },

    removeListItem(state, payload) {
      if (state[payload.list]) {
        state[payload.list].splice(payload.index, 1);
      }
    },

    sortAttacks(state, payload) {
      var id = payload.id;
      var direction = payload.direction;
      var curIndex = state.attacks.findIndex((a) => a.id === id);

      if (curIndex === -1) return;

      if (direction === 'up') {
        if (curIndex === 0) return;
        var deletedAttacks = state.attacks.splice(curIndex, 1);
        var attackToMove = deletedAttacks[0];
        state.attacks.splice(curIndex - 1, 0, attackToMove);
        return;
      }

      if (direction === 'down') {
        if (curIndex === state.attacks.length - 1) return;
        var deletedAttacks = state.attacks.splice(curIndex, 1);
        var attackToMove = deletedAttacks[0];
        state.attacks.splice(curIndex + 1, 0, attackToMove);
        return;
      }
    },

    updateCoins(state, payload) {
      if (payload.i >= state.coins.length) return;
      Vue.set(state.coins[payload.i], 'amount', payload.amount);
    },

    updateEquipment(state, payload) {
      state.equipmentText = payload.val;
    },

    updateTextField(state, payload) {
      if (!state.hasOwnProperty(payload.field)) return;
      state[payload.field] = payload.val;
    },

    updateField(state, payload) {
      // General purpose updater for any top-level field
      Vue.set(state, payload.field, payload.val);
    },

    updateNestedField(state, payload) {
      // For arrays/objects
      if (!state[payload.field]) return;
      Vue.set(state[payload.field], payload.key, payload.val);
    },

    addToListField(state, payload) {
      if (!state.hasOwnProperty(payload.field)) return;
      state[payload.field].push({
        val: payload.val,
        id: Math.random().toString(),
      });
    },

    updateListField(state, payload) {
      if (!state.hasOwnProperty(payload.field)) return;
      Vue.set(state[payload.field][payload.i], 'val', payload.val);
      Vue.set(state[payload.field][payload.i], 'collapsed', payload.collapsed);
    },

    deleteFromListField(state, payload) {
      if (!state.hasOwnProperty(payload.field)) return;
      if (payload.i >= state[payload.field].length) return;
      state[payload.field].splice(payload.i, 1);
    },

    sortListField(state, payload) {
      var field = payload.field;
      var direction = payload.direction;
      var curIndex = state[field].findIndex((item) => item.id === payload.id);

      if (curIndex === -1) return;

      if (direction === 'up') {
        if (curIndex === 0) return;
        var deletedItems = state[field].splice(curIndex, 1);
        var itemToMove = deletedItems[0];
        state[field].splice(curIndex - 1, 0, itemToMove);
        return;
      }

      if (direction === 'down') {
        if (curIndex === state[field].length - 1) return;
        var deletedItems = state[field].splice(curIndex, 1);
        var itemToMove = deletedItems[0];
        state[field].splice(curIndex + 1, 0, itemToMove);
        return;
      }
    },

    updateSpellInfo(state, payload) {
      var allowedFields = ['spClass', 'spAbility', 'spSave', 'spAttack'];
      var field = payload.field;
      if (!allowedFields.includes(field)) return;
      if (!state.hasOwnProperty(field)) return;
      state[field] = payload.val;
    },

    addSpell(state, payload) {
      if (!state.hasOwnProperty(payload.field)) return;
      state[payload.field].spells.push(payload.item);
    },

    updateSpellName(state, payload) {
      if (!state.hasOwnProperty(payload.field)) return;
      Vue.set(state[payload.field].spells[payload.i], 'name', payload.name);
    },

    updateSpellPrepared(state, payload) {
      if (!state.hasOwnProperty(payload.field)) return;
      Vue.set(
        state[payload.field].spells[payload.i],
        'prepared',
        payload.prepared,
      );
    },

    updateSpellCollapsed(state, payload) {
      if (!state.hasOwnProperty(payload.field)) return;
      Vue.set(
        state[payload.field].spells[payload.i],
        'collapsed',
        payload.collapsed,
      );
    },

    deleteSpell(state, payload) {
      if (!state.hasOwnProperty(payload.field)) return;
      state[payload.field].spells.splice(payload.i, 1);
    },

    updateSpellSlots(state, payload) {
      if (!state.hasOwnProperty(payload.field)) return;
      Vue.set(state[payload.field], 'slots', payload.val);
    },

    updateExpendedSlots(state, payload) {
      if (!state.hasOwnProperty(payload.field)) return;
      Vue.set(state[payload.field], 'expended', payload.val);
    },

    sortSpells(state, payload) {
      var field = payload.field;
      var direction = payload.direction;
      var curIndex = state[field].spells.findIndex(
        (spell) => spell.id === payload.id,
      );

      if (curIndex === -1) return;

      if (direction === 'up') {
        if (curIndex === 0) return;
        var deletedSpells = state[field].spells.splice(curIndex, 1);
        var spellToMove = deletedSpells[0];
        state[field].spells.splice(curIndex - 1, 0, spellToMove);
        return;
      }

      if (direction === 'down') {
        if (curIndex === state[field].spells.length - 1) return;
        var deletedSpells = state[field].spells.splice(curIndex, 1);
        var spellToMove = deletedSpells[0];
        state[field].spells.splice(curIndex + 1, 0, spellToMove);
        return;
      }
    },
  },

  actions: {
    getJSON({ state }) {
      return new Promise((resolve, reject) => {
        try {
          var json = JSON.stringify(state);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    },

    initializeState({ commit }, payload) {
      var sheet = JSON.parse(payload.sheet);
      
      // Determine system
      var system = window.system || sheet.system || (sheet.is_2024 ? 'dnd5e_2024' : 'dnd5e_2014');
      
      // Start with system default state
      var defaultState = JSON.parse(JSON.stringify(getSystemDefaultState(system)));
      var state = Object.assign({}, defaultState);

      if (sheet.data) {
        // merge sheet data on top of defaults
        try {
          var sheetData = typeof sheet.data === 'string' ? JSON.parse(sheet.data) : sheet.data;
          state = Object.assign({}, state, sheetData);
        } catch (e) {
          console.error("Failed to parse sheet data", e);
        }
      }

      // System specific initialization
      if (system.startsWith('dnd5e')) {
          // default initiative to dex modifier
          if (!state.initiative && state.abilities) {
            const dex = state.abilities.find((ability) => ability.name === 'DEX');
            if (dex) {
                state.initiative = Math.floor(parseInt(dex.score) / 2 - 5);
            }
          }

          // ensure existing attacks have weaponNotes field
          if (state.attacks && state.attacks.length > 0) {
            state.attacks.forEach((attack) => {
              if (!attack.hasOwnProperty('weaponNotes')) {
                attack.weaponNotes = '';
              }
            });
          }

          // ensure cantripsList has collapsed boolean
          if (state.cantripsList && state.cantripsList.length > 0) {
            state.cantripsList.forEach((cantrip) => {
              if (!cantrip.hasOwnProperty('collapsed')) {
                cantrip.collapsed = false;
              }
            });
          }

          // ensure spell lists have collapsed boolean
          if (state.lvl1Spells && state.lvl1Spells.spells.length > 0) {
            state.lvl1Spells.spells.forEach((spell) => {
              if (!spell.hasOwnProperty('collapsed')) {
                spell.collapsed = false;
              }
            });
          }
      }

      state.id = sheet.id;
      state.slug = sheet.slug;
      state.system = system;
      state.is_2024 = (system === 'dnd5e_2024');

      // Use window.characterName if state.characterName is missing or empty
      if (!state.characterName && typeof window.characterName !== 'undefined') {
        state.characterName = window.characterName;
      }

      state.readOnly = sheet.is_public && sheet.email === null;

      commit('replaceState', { state });
    },

    updateState({ commit }, payload) {
      var sheet = payload.sheet;
      var system = sheet.system || (sheet.is_2024 ? 'dnd5e_2024' : 'dnd5e_2014');
      
      // Start with system default state
      var defaultState = JSON.parse(JSON.stringify(getSystemDefaultState(system)));
      var state = Object.assign({}, defaultState);

      if (sheet.data) {
        // merge sheet data on top of defaults
        try {
          var sheetData = typeof sheet.data === 'string' ? JSON.parse(sheet.data) : sheet.data;
          state = Object.assign({}, state, sheetData);
        } catch (e) {
          console.error("Failed to parse sheet data", e);
        }
      }

      // System specific initialization (D&D 5e)
      if (system.startsWith('dnd5e')) {
          if (state.attacks && state.attacks.length > 0) {
            state.attacks.forEach((attack) => {
              if (!attack.hasOwnProperty('weaponNotes')) {
                attack.weaponNotes = '';
              }
            });
          }
      }

      state.id = sheet.id;
      state.characterName = sheet.name;
      state.system = system;
      state.is_2024 = (system === 'dnd5e_2024');
      state.readOnly = sheet.is_public && sheet.email === null;

      commit('replaceState', { state });

      // we need to let the quill editors know to update their contents
      window.sheetEvent.$emit('quill-refresh');
    },
  },
});

function objectIsEmpty(obj) {
  for (let prop in obj) {
    if (prop === 'id') continue;
    if (!obj.hasOwnProperty(prop)) continue;
    if (obj[prop]) return false;
  }
  return true;
}
