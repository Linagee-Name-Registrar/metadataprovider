import { ens_normalize } from '@adraffy/ens-normalize';

export function checkEmoji(text){
    const normalized = ens_normalize(text);
    if(normalized == text){
        console.log('good');
        //Some way to label normalized
        return true;
        } else{
            console.log('bad');
            return false;
        //Some way to label not normalzied
        
        
        }
}