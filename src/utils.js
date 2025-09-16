export const buildNewGrid = () => {
    const newDice = ["AAEEGN","ELRTTY","AOOTTW","ABBJOO","EHRTVW","CIMOTU","DISTTY","EIOSST","DELRVY","ACHOPS","HIMNQU","EEINSU","EEGHNW","AFFKPS","HLNNRZ","DEILRX","AAEEGN","ACHOPS","AFFKPS","DEILRX","DELRVY","EEGHNW","EIOSST","HIMNQU","HLNNRZ",
        ];
        let shuffledDice = [];
        while (newDice.length > 0) {
        let randomDie = newDice.splice(Math.floor(Math.random() * newDice.length), 1);
    
        shuffledDice.push(randomDie);
        }
    
        let letters = shuffledDice.map((die) =>
        die[0].charAt(Math.floor(Math.random() * die[0].length))
        );
        return letters.map((letter,index) => ({
        index:index,
        letter:letter,
        allegiance:'none',
        clicked:false
    })); 
}