let DEFAULT_PASSWORD = ''
if (process.env.NODE_ENV === 'development') {
  DEFAULT_PASSWORD = 'password'
}


export {DEFAULT_PASSWORD}
