async function waitFor(time: number): Promise<any> {
  return new Promise((reject, resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export {
  waitFor
}
