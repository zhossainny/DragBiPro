import { primitiveOrNull } from './../../functions/utils';
import * as _ from 'lodash';

const withChangeDetection = WrappedOptionsComponent => {
    return class OptionsWrapper extends WrappedOptionsComponent {
        settingsChanged = e => {
            let value = primitiveOrNull(e.target.value);
            let copy = { ...this.props.settings };
            _.set(copy, e.target.name, value);
            this.props.onSettingsChanged(copy);
        }
        
        render() {
            return super.render();
        }
    };
};

export default withChangeDetection;