import httpRequest from "../utils/request";
import { GetAllBackground, SetBackground, GetPrivilege } from "../config/index";

const getAllBackground = () => {
  return httpRequest({
    method: GetAllBackground.method,
    url: GetAllBackground.url,
    data: {}
  });
};
const setBackground = data => {
  return httpRequest({
    method: SetBackground.method,
    url: SetBackground.url,
    data: data
  });
};
const getPrivilegeRequest = data => {
  return httpRequest({
    method: GetPrivilege.method,
    url: GetPrivilege.url,
    data: data
  });
};

export { getAllBackground, setBackground, getPrivilegeRequest };
