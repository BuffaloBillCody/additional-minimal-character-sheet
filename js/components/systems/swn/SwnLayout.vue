<template>
  <div class="swn-layout">
    <div class="page" v-show="view === 'main'">
      <!-- Bio Section -->
      <div class="bio card mb-md">
        <div class="flex flex-wrap gap-lg">
          <div>
            <label class="block mb-xs">Name</label>
            <input type="text" class="field field-visible" style="width: 100px;" :value="characterName" @input="updateField('characterName', $event.target.value)" :readonly="readOnly">
          </div>
          <div>
            <label class="block mb-xs">Class</label>
            <input type="text" class="field field-visible" style="width: 100px;" :value="classInfo" @input="updateField('class', $event.target.value)" :readonly="readOnly" placeholder="Class">
          </div>
          <div>
            <label class="block mb-xs text-center">Level</label>
            <input type="number" class="field field-visible text-center" style="width: 100px;" :value="level" @input="updateField('level', parseInt($event.target.value))" :readonly="readOnly">
          </div>
          <div>
            <label class="block mb-xs text-center">XP</label>
            <input type="number" class="field field-visible text-center" style="width: 100px;" :value="xp" @input="updateField('xp', parseInt($event.target.value))" :readonly="readOnly">
          </div>
        </div>
        <div class="flex flex-wrap gap-lg mt-md">
          <div>
            <label class="block mb-xs">Background</label>
            <input type="text" class="field field-visible" style="width: 100px;" :value="background" @input="updateField('background', $event.target.value)" :readonly="readOnly" placeholder="Background">
          </div>
          <div>
            <label class="block mb-xs">Homeworld</label>
            <input type="text" class="field field-visible" style="width: 100px;" :value="homeworld" @input="updateField('homeworld', $event.target.value)" :readonly="readOnly" placeholder="Homeworld">
          </div>
          <div>
            <label class="block mb-xs">Employer</label>
            <input type="text" class="field field-visible" style="width: 100px;" :value="employer" @input="updateField('employer', $event.target.value)" :readonly="readOnly" placeholder="Employer">
          </div>
          <div>
            <label class="block mb-xs">Species</label>
            <input type="text" class="field field-visible" style="width: 100px;" :value="species" @input="updateField('species', $event.target.value)" :readonly="readOnly" placeholder="Species">
          </div>
        </div>
      </div>

      <!-- Core Stats -->
      <div class="card mb-md flex flex-wrap">
        <!-- Attributes -->
        <div class="flex-grow pr-md">
          <h3 class="mb-sm">Attributes</h3>
          <div v-for="(attr, i) in attributes" :key="attr.name" class="flex align-items-center mb-xs">
            <label class="bold mr-sm" style="width: 40px;">{{ attr.name }}</label>
            <input type="number" class="field field-visible text-center" style="width: 50px;" :value="attr.score" @input="updateNestedField('attributes', i, { ...attr, score: parseInt($event.target.value) })" :readonly="readOnly">
            <div class="modifier-box ml-sm flex-grow text-center bold">
              {{ modifiers[i]?.val | signedNumString }}
            </div>
          </div>
        </div>

        <!-- Vertical Separator -->
        <div style="border-left: 1px solid rgba(0,0,0,0.1); margin: 0 1rem;"></div>

        <!-- Saves -->
        <div class="flex-grow px-md">
          <h3 class="mb-sm">Saves</h3>
          <div class="flex flex-column gap-sm">
            <div class="flex align-items-center">
              <label style="width: 70px;">Physical</label>
              <input type="number" class="field field-visible text-center" style="width: 60px;" :value="saves.physical" @input="updateNestedField('saves', 'physical', parseInt($event.target.value))" :readonly="readOnly">
            </div>
            <div class="flex align-items-center">
              <label style="width: 70px;">Evasion</label>
              <input type="number" class="field field-visible text-center" style="width: 60px;" :value="saves.evasion" @input="updateNestedField('saves', 'evasion', parseInt($event.target.value))" :readonly="readOnly">
            </div>
            <div class="flex align-items-center">
              <label style="width: 70px;">Mental</label>
              <input type="number" class="field field-visible text-center" style="width: 60px;" :value="saves.mental" @input="updateNestedField('saves', 'mental', parseInt($event.target.value))" :readonly="readOnly">
            </div>
          </div>
        </div>

        <!-- Vertical Separator -->
        <div style="border-left: 1px solid rgba(0,0,0,0.1); margin: 0 1rem;"></div>

        <!-- Vitals & Combat -->
        <div class="flex-grow pl-md">
          <h3 class="mb-sm">Vitals</h3>
          <div class="flex flex-column gap-sm">
            <div class="flex align-items-center">
              <label class="bold" style="width: 140px;">Hit Points</label>
              <div class="flex align-items-center">
                <input type="number" class="field field-visible text-center" style="width: 50px;" :value="hp" @input="updateField('hp', parseInt($event.target.value))" :readonly="readOnly">
                <span class="mx-xs">/</span>
                <input type="number" class="field field-visible text-center" style="width: 50px;" :value="maxHp" @input="updateField('maxHp', parseInt($event.target.value))" :readonly="readOnly">
              </div>
            </div>
            <div class="flex align-items-center">
              <label class="bold" style="width: 140px;">Psionic Effort</label>
              <div class="flex align-items-center">
                <input type="number" class="field field-visible text-center" style="width: 50px;" :value="psionicEffort.current" @input="updateNestedField('psionicEffort', 'current', parseInt($event.target.value))" :readonly="readOnly">
                <span class="mx-xs">/</span>
                <input type="number" class="field field-visible text-center" style="width: 50px;" :value="psionicEffort.max" @input="updateNestedField('psionicEffort', 'max', parseInt($event.target.value))" :readonly="readOnly">
              </div>
            </div>
            <div class="flex align-items-center">
              <label class="bold" style="width: 140px;">System Strain</label>
              <div class="flex align-items-center">
                <input type="number" class="field field-visible text-center" style="width: 50px;" :value="systemStrain" @input="updateField('systemStrain', parseInt($event.target.value))" :readonly="readOnly">
                <span class="mx-xs">/</span>
                <input type="number" class="field field-visible text-center" style="width: 50px;" :value="permanentSystemStrain" @input="updateField('permanentSystemStrain', parseInt($event.target.value))" :readonly="readOnly" title="Permanent System Strain">
              </div>
            </div>
          </div>

          <h3 class="mb-sm mt-lg">Combat</h3>
          <div class="flex flex-column gap-sm">
            <div class="flex align-items-center">
              <label style="width: 140px;">Base Attack Bonus</label>
              <input type="number" class="field field-visible text-center" style="width: 60px;" :value="baseAttackBonus" @input="updateField('baseAttackBonus', parseInt($event.target.value))" :readonly="readOnly">
            </div>
            <div class="flex align-items-center">
              <label style="width: 140px;">Skill Points</label>
              <input type="number" class="field field-visible text-center" style="width: 60px;" :value="skillPoints" @input="updateField('skillPoints', parseInt($event.target.value))" :readonly="readOnly">
            </div>
          </div>
        </div>

        <!-- Vertical Separator -->
        <div style="border-left: 1px solid rgba(0,0,0,0.1); margin: 0 1rem;"></div>

        <!-- Skills -->
        <div class="flex-grow pl-md" style="flex-basis: 45%;">
          <h3 class="mb-sm">Skills</h3>
          <div class="skills-grid" style="grid-template-columns: repeat(3, 1fr); gap: 0.25rem 1rem;">
            <div v-for="(skill, i) in skills" :key="skill.name" class="skill-item">
              <label :class="{ 'bold': skill.level > -1, 'muted': skill.level === -1 }">{{ skill.name }}</label>
              <select class="field field-visible" :value="skill.level" @change="updateNestedField('skills', i, { ...skill, level: parseInt($event.target.value) })" :disabled="readOnly">
                <option value="-1">-</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Weapons & Armor Section -->
      <div class="card mt-md">
        <h3 class="mb-sm text-center">Weapons</h3>
        <div class="table-wrapper">
          <table class="w-full weapon-table" v-if="weapons.length > 0">
            <thead>
              <tr>
                <th class="text-left">Weapon Name</th>
                <th>Range / Ammo</th>
                <th>Atk Bonus</th>
                <th>Damage</th>
                <th>Mods</th>
                <th style="width: 30px;" v-if="!readOnly"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(w, i) in weapons" :key="i">
                <td><input type="text" class="field field-visible size-full" :value="w.name" @input="updateNestedField('weapons', i, { ...w, name: $event.target.value })" :readonly="readOnly"></td>
                <td><input type="text" class="field field-visible size-full text-center" :value="w.rangeAmmo" @input="updateNestedField('weapons', i, { ...w, rangeAmmo: $event.target.value })" :readonly="readOnly"></td>
                <td><input type="text" class="field field-visible size-full text-center" :value="w.atkBonus" @input="updateNestedField('weapons', i, { ...w, atkBonus: $event.target.value })" :readonly="readOnly"></td>
                <td><input type="text" class="field field-visible size-full text-center" :value="w.damage" @input="updateNestedField('weapons', i, { ...w, damage: $event.target.value })" :readonly="readOnly"></td>
                <td><input type="text" class="field field-visible size-full" :value="w.mods" @input="updateNestedField('weapons', i, { ...w, mods: $event.target.value })" :readonly="readOnly"></td>
                <td class="text-center" v-if="!readOnly">
                  <button type="button" class="button button-delete" @click="removeItem('weapons', i)" title="Delete weapon"><i class="fa-solid fa-xmark"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="text-center mt-sm" v-if="!readOnly">
            <button type="button" class="button button-add" title="Add Weapon" @click="addWeapon"><i class="fa-solid fa-plus"></i></button>
          </p>
        </div>

        <h3 class="mb-sm mt-lg text-center">Armor</h3>
        <div class="table-wrapper">
          <table class="w-full armor-table" v-if="armor.length > 0">
            <thead>
              <tr>
                <th class="text-left">Armor Name</th>
                <th>AC</th>
                <th>Mods / Encumbrance</th>
                <th style="width: 30px;" v-if="!readOnly"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(a, i) in armor" :key="i">
                <td><input type="text" class="field field-visible size-full" :value="a.name" @input="updateNestedField('armor', i, { ...a, name: $event.target.value })" :readonly="readOnly"></td>
                <td style="width: 100px;"><input type="number" class="field field-visible size-full text-center" :value="a.ac" @input="updateNestedField('armor', i, { ...a, ac: parseInt($event.target.value) })" :readonly="readOnly"></td>
                <td><input type="text" class="field field-visible size-full" :value="a.mods" @input="updateNestedField('armor', i, { ...a, mods: $event.target.value })" :readonly="readOnly"></td>
                <td class="text-center" v-if="!readOnly">
                  <button type="button" class="button button-delete" @click="removeItem('armor', i)" title="Delete armor"><i class="fa-solid fa-xmark"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="text-center mt-sm" v-if="!readOnly">
            <button type="button" class="button button-add" title="Add Armor" @click="addArmor"><i class="fa-solid fa-plus"></i></button>
          </p>
        </div>
      </div>
    </div>

    <!-- Other views remain same or slightly improved -->
    <div class="page" v-show="view === 'abilities'">
      <text-section title="Foci" field="foci" :read-only="readOnly"></text-section>
      <text-section title="Psionic Techniques" field="psionicTechniques" :read-only="readOnly"></text-section>
      <text-section title="Cybernetics & Innate Abilities" field="cybernetics" :read-only="readOnly"></text-section>
    </div>

    <div class="page" v-show="view === 'inventory'">
      <div class="card mb-md">
        <div class="flex justify-content-between align-items-center mb-sm">
          <h3>Credits / Debts</h3>
          <div class="flex align-items-center">
             <label class="mr-sm">Credits:</label>
             <input type="number" class="field field-visible text-right mr-md" style="width: 120px;" :value="credits" @input="updateField('credits', parseInt($event.target.value))" :readonly="readOnly">
             <label class="mr-sm">Debts:</label>
             <input type="number" class="field field-visible text-right" style="width: 120px;" :value="debts" @input="updateField('debts', parseInt($event.target.value))" :readonly="readOnly">
          </div>
        </div>
      </div>

      <text-section title="Readied Items" field="readiedItems" :read-only="readOnly"></text-section>
      <text-section title="Stowed Equipment (Backpack)" field="stowedEquipment" :read-only="readOnly"></text-section>
      <text-section title="Non-Encumbering Equipment" field="nonEncumberingEquipment" :read-only="readOnly"></text-section>
      <text-section title="Equipment in Storage / Assets" field="equipmentInStorage" :read-only="readOnly"></text-section>
    </div>

    <div class="page" v-show="view === 'details'">
      <div class="grid-layout">
        <div class="grid-col">
          <text-section title="Contacts and Allies" field="contacts" :read-only="readOnly"></text-section>
          <text-section title="Aliases / IDs" field="aliases" :read-only="readOnly"></text-section>
        </div>
        <div class="grid-col">
          <text-section title="Current Goals" field="goalsText" :read-only="readOnly"></text-section>
          <text-section title="Achievements" field="achievementsText" :read-only="readOnly"></text-section>
        </div>
      </div>
      <text-section title="Vehicle, Robot, and Drone Details" field="vehicleDetails" :read-only="readOnly"></text-section>
      <text-section title="Starship Details" field="starshipDetails" :read-only="readOnly"></text-section>
    </div>

    <div class="page" v-show="view === 'notes'">
      <text-section title="Notes" field="notesText" :read-only="readOnly"></text-section>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { signedNumString } from '../../../utils';
import TextSection from '../../TextSection';
import Field from '../../Field';

export default {
  name: 'SwnLayout',
  props: {
    view: {
      type: String,
      default: 'main',
    },
  },
  filters: {
    signedNumString
  },
  computed: {
    ...mapState([
      'readOnly', 'characterName', 'class', 'level', 'xp', 'background', 'homeworld', 'species', 'employer',
      'attributes', 'hp', 'maxHp', 'systemStrain', 'permanentSystemStrain', 'baseAttackBonus', 'skillPoints',
      'saves', 'skills', 'psionicEffort', 'credits', 'debts', 'weapons', 'armor'
    ]),
    ...mapGetters(['modifiers']),
    classInfo() {
      return this.$store.state.class;
    }
  },
  methods: {
    updateField(field, val) {
      this.$store.commit('updateField', { field, val });
    },
    updateNestedField(field, key, val) {
      this.$store.commit('updateNestedField', { field, key, val });
    },
    addWeapon() {
      this.$store.commit('addListItem', { list: 'weapons', item: { name: '', rangeAmmo: '', atkBonus: '', damage: '', mods: '' } });
    },
    addArmor() {
      this.$store.commit('addListItem', { list: 'armor', item: { name: '', ac: '', mods: '' } });
    },
    removeItem(list, index) {
      this.$store.commit('removeListItem', { list, index });
    }
  },
  components: {
    'text-section': TextSection,
    'field': Field,
  },
};
</script>

<style scoped lang="scss">
.flex-column {
  display: flex;
  flex-direction: column;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem; /* Increase gap to prevent overlapping */
}

/* Add visual separation to card headers */
.card h3 {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  color: #444;
}

/* Ensure flex items in the bio section space nicely */
.bio .flex-grow {
  min-width: 150px;
}

.modifier-box {
  background: rgba(0,0,0,0.05);
  border-radius: 4px;
  padding: 4px;
  min-width: 40px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.5rem 1.5rem;
  
  .skill-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 0.9rem;
    gap: 0.5rem;
    
    label {
      width: 100px;
    }
    
    select {
      width: 50px;
      padding: 2px;
      font-size: 1.1rem;
    }
  }
}

.weapon-table, .armor-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 4px;
  min-width: 600px; /* Prevent text squishing */

  th { 
    font-size: 0.8rem; 
    color: #666; 
    padding: 4px 8px;
    text-transform: uppercase;
    border-bottom: 1px solid #ccc;
  }
  
  td { 
    padding: 2px 4px; 
  }

  /* Make inputs in these tables distinctly visible as boxes */
  .field {
    border: 1px solid #ccc;
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 4px;
    padding: 6px;
    box-sizing: border-box;
    transition: border-color 0.2s;
    
    &:focus {
      border-color: #888;
      background-color: #fff;
    }
  }
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.h-full { height: 100%; }
.size-full { width: 100%; }
</style>
