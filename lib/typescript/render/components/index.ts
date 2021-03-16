import {CommandUnion} from '../shared';

export interface DefaultMessageRenderingProps {
  fromContact?: boolean;
  commandCallback?: (command: CommandUnion) => void;
}
