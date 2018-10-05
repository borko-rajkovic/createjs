
export const setToken = (state, token) => {
  console.log(token)
  state.token = token
  localStorage.setItem('token', JSON.stringify(token))
}
