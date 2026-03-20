import dnd5e_2014 from './dnd5e_2014';
import dnd5e_2024 from './dnd5e_2024';
import custom from './custom';
import swn from './swn';
import wwn from './wwn';

export const systems = {
  dnd5e_2014,
  dnd5e_2024,
  custom,
  swn,
  wwn,
};

export function getSystemDefaultState(system) {
  return systems[system] || systems['dnd5e_2014'];
}
