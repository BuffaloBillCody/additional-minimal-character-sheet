<template>
  <div class="print-sheet wwn-print">
    <h1 class="character-name text-left">{{ characterName }}</h1>
    
    <div class="flex flex-wrap mb-md gap-md border-bottom pb-sm">
      <print-field :value="classInfo" label="Class"></print-field>
      <print-field :value="level" label="Level"></print-field>
      <print-field :value="xp" label="XP"></print-field>
      <print-field :value="homeland" label="Homeland"></print-field>
      <print-field :value="occupation" label="Occupation"></print-field>
      <print-field :value="species" label="Species"></print-field>
    </div>

    <div class="flex gap-lg mb-md">
      <div style="width: 250px;">
        <p class="header">Attributes</p>
        <div v-for="(attr, i) in attributes" :key="attr.name" class="flex align-items-center mb-xs">
          <div class="bold mr-sm" style="width: 40px;">{{ attr.name }}</div>
          <div class="print-box text-center mr-sm" style="width: 40px;">{{ attr.score }}</div>
          <div class="print-box flex-grow text-center bold">{{ modifiers[i]?.val | signedNumString }}</div>
        </div>
      </div>

      <div class="flex-grow">
        <p class="header">Vitals & Combat</p>
        <div class="flex flex-wrap gap-md">
          <print-field :value="hp + ' / ' + maxHp" label="Hit Points" box center></print-field>
          <print-field :value="systemStrain + ' / ' + maxSystemStrain" label="System Strain" box center></print-field>
          <print-field :value="baseAttackBonus" label="Base Atk Bonus" box center></print-field>
          <print-field :value="armorClass" label="Armor Class" box center></print-field>
        </div>
        <div class="flex flex-wrap gap-md mt-md">
          <print-field :value="meleeAttackBonus" label="Melee Bonus" box center></print-field>
          <print-field :value="rangedAttackBonus" label="Ranged Bonus" box center></print-field>
          <print-field :value="initiativeBonus" label="Initiative" box center></print-field>
        </div>
        <div class="flex flex-wrap gap-md mt-md">
          <print-field :value="saves.physical" label="Physical Save" box center></print-field>
          <print-field :value="saves.evasion" label="Evasion Save" box center></print-field>
          <print-field :value="saves.mental" label="Mental Save" box center></print-field>
          <print-field :value="saves.luck" label="Luck Save" box center></print-field>
        </div>
      </div>
    </div>

    <div class="skills mt-lg mb-md">
      <p class="header">Skills</p>
      <div class="skills-print-grid">
        <div v-for="skill in skills" :key="skill.name" class="skill-print-item" v-if="skill.level > -1">
          <strong>{{ skill.level }}</strong> {{ skill.name }}
        </div>
      </div>
    </div>

    <div class="weapons mt-lg mb-md" v-if="hasWeapons">
      <p class="header">Weapons</p>
      <table class="print-table">
        <thead>
          <tr>
            <th class="text-left">Weapon</th>
            <th>Hit Bonus</th>
            <th>Damage</th>
            <th>Range</th>
            <th>Special / Shock</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(w, i) in weapons" :key="i" v-if="w.name">
            <td>{{ w.name }}</td>
            <td class="text-center">{{ w.bonusToHit }}</td>
            <td class="text-center">{{ w.damage }}</td>
            <td class="text-center">{{ w.range }}</td>
            <td>{{ w.specialShock }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-for="section in textSections" :key="section.title">
      <div class="mt-lg no-break" v-if="hasQuillContent(section.text) || section.title === 'Notes'">
        <p class="header">{{ section.title }}</p>
        <div class="quill-html" v-html="getHtmlFromQuill(section.text)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Quill from 'quill';
import { mapState, mapGetters } from 'vuex';
import { signedNumString } from '../../../utils';
import PrintField from '../../PrintField.vue';

export default {
  name: 'WwnPrint',
  filters: {
    signedNumString
  },
  computed: {
    ...mapState([
      'characterName', 'class', 'level', 'xp', 'homeland', 'occupation', 'species',
      'attributes', 'hp', 'maxHp', 'systemStrain', 'maxSystemStrain', 'baseAttackBonus', 'armorClass',
      'meleeAttackBonus', 'rangedAttackBonus', 'initiativeBonus',
      'saves', 'skills', 'foci', 'magicalArts', 'highMagic', 'readiedItems', 'stowedItems', 'storedItems',
      'notesText', 'projects', 'mountDetails', 'weapons'
    ]),
    ...mapGetters(['modifiers']),
    classInfo() { return this.$store.state.class; },
    hasWeapons() {
      return this.weapons.some(w => w.name);
    },
    textSections() {
      return [
        { title: 'Foci', text: this.foci },
        { title: 'Magical Arts', text: this.magicalArts },
        { title: 'High Magic', text: this.highMagic },
        { title: 'Readied Items', text: this.readiedItems },
        { title: 'Stowed Items', text: this.stowedItems },
        { title: 'Stored Items', text: this.storedItems },
        { title: 'Projects', text: this.projects },
        { title: 'Mount Details', text: this.mountDetails },
        { title: 'Notes', text: this.notesText },
      ];
    }
  },
  methods: {
    getHtmlFromQuill(delta) {
      if (!delta) return '';
      const container = document.createElement('div');
      const quill = new Quill(container);
      quill.setContents(delta);
      return quill.getSemanticHTML().replaceAll('&nbsp;', ' ');
    },
    hasQuillContent(delta) {
      return delta && delta.ops && !(delta.ops.length === 1 && delta.ops[0].insert === '\n');
    },
  },
  components: { 'print-field': PrintField }
};
</script>

<style scoped>
.print-box {
  border: 1px solid #000;
  padding: 2px 5px;
  min-height: 24px;
}
.skills-print-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
}
.print-table {
  width: 100%;
  border-collapse: collapse;
}
.print-table th, .print-table td {
  border: 1px solid #eee;
  padding: 4px;
  font-size: 0.9rem;
}
.no-break {
  page-break-inside: avoid;
}
</style>
