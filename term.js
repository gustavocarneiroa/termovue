new Vue({
    el: '#app',
    vuetify: new Vuetify({theme: { dark: true }}),
    data() {
        return {
            snackbar: false,
            snackbarColor: 'success',
            text: 'ACERTOU ;)',
            ATTEMPT_LIMIT: 6,
            word: '',
            attempts: 0,
            randomWord: '',
            wrongWords: [],
            rightAttempts: [],
            loading: false,
            alphabet: 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => {
                return {
                    letter: letter,
                    disabled: false
                }
            })
        }
    },
    methods: {
        addLetter(letter) {
            this.word += letter;
            if (this.word.length === 5) this.onFinish(this.word)
        },

        addAttempt() {
            return this.attempts = this.attempts + 1
        },

        isLetter(event) {
            const char = String.fromCharCode(event.keyCode);
            if (/^[A-Za-z]+$/.test(char)) return true;
            else event.preventDefault();
        },

        getRandomWord() {
            const normalizedWords = words.map(word => word.normalize("NFD").replace(/[^a-zA-Zs]/g, "").toLowerCase());
            return normalizedWords[~~(normalizedWords.length * Math.random())];
        },

        onFinish(response) {

            if (this.word === this.randomWord) {
                this.loading = true;
                this.snackbar = true
            }
            else {
                if (this.wrongWords.length === this.ATTEMPT_LIMIT - 1) return this.$refs.attempt.focus();
                this.addAttempt();

                this.word = ''
                this.$refs.attempt.focus();
        
                const attemptLetters = response.split('');
                const rightWordLetters = this.randomWord.split('');

                const wrongLetters = attemptLetters.filter(x => !rightWordLetters.includes(x));

                wrongLetters.forEach(letter => {
                    const index = this.alphabet.map(l => l.letter).indexOf(letter);
                    this.alphabet[index].disabled = Boolean(true);
                })

                this.rightAttempts = attemptLetters.filter(x => rightWordLetters.includes(x)).filter((unique, index, self) => self.indexOf(unique) == index)
                this.wrongWords.push({
                    word: response,
                    rightLetters: this.rightAttempts
                });
            }
        },

    },

    mounted() {
        this.randomWord = this.getRandomWord()
    }
});