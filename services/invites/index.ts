import "server-only";
import Sqids from "sqids";

const sqids = new Sqids({
  alphabet: process.env.SQID_ALPHABET,
  minLength: 6,
})

const instanceIdToInviteCode = (instanceId: number) => {
  return sqids.encode([instanceId]);
}

const inviteCodeToInstanceId = (inviteCode: string) => {
  return sqids.decode(inviteCode)[0];
}

const service = {
  instanceIdToInviteCode,
  inviteCodeToInstanceId,
};

export default service;
