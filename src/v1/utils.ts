export const getGlobalState = (client, appId) => {
  return 1
}
/*
"""Returns dict of global state for application with the given app_id

:param client: algod client
:type client: :class:`AlgodClient`
:param app_id: id of the application
:type app_id: int
:return: dict of global state for application with id app_id
:rtype: dict
"""
return format_state(client.application_info(app_id)["params"]['global-state'])
*/
