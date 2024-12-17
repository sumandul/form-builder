import { RootState } from "../store";

export default function checkIfLoading(
  store: RootState,
  actionsToCheck: string[]
) {
  return store.loader.actions.some((action) => actionsToCheck.includes(action));
}
