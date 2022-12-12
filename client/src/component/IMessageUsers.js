import React from "react";
import { QUERY_USER } from "../utils/queries";
import { useQuery } from "@apollo/client";

export default function IMessageUsers() {
  const { loading: loading, error: error, data: data } = useQuery(QUERY_USER);

  let iMessageUsers = [];
  let index = 0;

  // const options = data.map((name, email) => {
  //   iMessageUsers = [{ key: index, text: name, value: email }];
  //   index++;
  const users = data?.users || [];
  let options = [<option></option>];

  if (data) {
    options = users.map((name, email) => {
      return <option data-email={email}>{name}</option>;
    });
  }

  return options;
}

//event.target.dataset
