export const validateUsername = (username: string): string | undefined => {
    if (username.length < 3) {
        return "Please enter a username that is at least 3 characters long"
    }

    var validRegex = /a-zA-Z0-9]+$/
    if (validRegex.test(username)) {
      return "Username must only contain alphanumeric characters"
    }

  }
  
export const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
        return "Please enter a password that is at least 8 characters long"
    }
}

export const validateName = (name: string): string | undefined => {
    if (!name.length) return `Please enter a value`
}