<template>
  <div class="dnd5e-layout">
    <bio></bio>

    <div class="page" v-show="view === 'main'">
      <proficiency></proficiency>
      <abilities></abilities>
      <skills></skills>
      <attacks></attacks>

      <text-section
        title="Features & Traits"
        field="featuresText"
        :read-only="readOnly"
      ></text-section>

      <equipment></equipment>

      <text-section
        title="Other Proficiencies & Languages"
        field="proficienciesText"
        :read-only="readOnly"
      ></text-section>
    </div>

    <div class="page" v-show="view === 'spells'">
      <spells></spells>
    </div>

    <div class="page" v-show="view === 'details'">
      <text-section
        title="Traits, Ideals, Bonds, & Flaws"
        field="personalityText"
        :read-only="readOnly"
        v-if="!is_2024"
      ></text-section>

      <text-section
        title="Appearance & Backstory"
        field="backstoryText"
        :read-only="readOnly"
      ></text-section>

      <text-section
        title="Treasure"
        field="treasureText"
        :read-only="readOnly"
      ></text-section>

      <text-section
        title="Allies & Organizations"
        field="organizationsText"
        :read-only="readOnly"
      ></text-section>
    </div>

    <div class="page" v-show="view === 'notes'">
      <text-section
        title="Notes"
        field="notesText"
        :read-only="readOnly"
      ></text-section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Abilities from '../../Abilities';
import Attacks from '../../Attacks';
import Bio from '../../Bio';
import Equipment from '../../Equipment';
import Proficiency from '../../Proficiency';
import Skills from '../../Skills';
import Spells from '../../Spells';
import TextSection from '../../TextSection';

export default {
  name: 'Dnd5eLayout',
  props: {
    view: {
      type: String,
      default: 'main',
    },
  },
  computed: {
    ...mapState(['is_2024', 'readOnly']),
  },
  components: {
    bio: Bio,
    abilities: Abilities,
    skills: Skills,
    proficiency: Proficiency,
    attacks: Attacks,
    equipment: Equipment,
    spells: Spells,
    'text-section': TextSection,
  },
};
</script>
