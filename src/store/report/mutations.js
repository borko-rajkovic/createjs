export const setUserGroups = (state, userGroups) => {
  state.userGroups = userGroups
}

export const setSchoolUser = (state, { groupId, schoolUsers }) => {
  state.schoolUsers[groupId] = schoolUsers
}

export const setPaperUserGroup = (state, { paperId, paperUserGroup}) => {
  state.paperUserGroups[paperId] = paperUserGroup
}
