
/**
 * 8 characters minimum.
 * Uppercase.
 * Lowercase.
 * Números.
 * Symbols
 * @param password 
 * @returns 
 */
const passwordValidator = async (password = '') => {
    if (password.length <= 7) throw new Error('Password length minimum 8 characters');
   	
        let capitalLetter = false;
        let tiny = false;
        let number = false;
        let symbol = false;
        
        for (let i = 0; i < password.length; i++) {
            if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) {
                capitalLetter = true;
            } else if (password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122) {
                tiny = true;
            } else if(password.charCodeAt(i) >= 48 && password.charCodeAt(i) <= 57) {
                number = true;
            } else {
                symbol = true;
            }
        }

        if(capitalLetter !== true || tiny !== true || symbol !== true || number !== true) {
            throw new Error('Invalid password format');
        }
}

module.exports = {
    passwordValidator
}