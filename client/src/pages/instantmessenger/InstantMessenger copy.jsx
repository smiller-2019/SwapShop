import React from "react";
import "./instantMessenger.css";
import Auth from "../../utils/auth";
import { QUERY_IMESSAGES, QUERY_ME, QUERY_USER } from "../../utils/queries";
import { useQuery, useMutation } from "@apollo/client";
import { Container, Button, Form } from "semantic-ui-react";
import { POST_IMESSAGE } from "../../utils/mutations";

export default function InstantMessenger() {
  let iName = "";
  let iEmail = "";

  const { loading: loading1, error: error1, data: data1 } = useQuery(QUERY_ME);
  const {
    loading: loading2,
    error: error2,
    data: data2,
  } = useQuery(QUERY_USER);

  const {
    loading: loading,
    error: error,
    data: data,
  } = useQuery(QUERY_IMESSAGES);

  const [postIMessage] = useMutation(POST_IMESSAGE);

  if (data2) {
    for (let i = 0; i < 3; i++) {
      console.log("data2.user.name[0] " + data2[i]);
    }
  }
  if (data1) {
    console.log("AFTER data1.me.name " + data1.me.name);
    iName = data1.me.name;
    iEmail = data1.me.email;
  }
  console.log("The current user is" + iName + " " + iEmail);

  const [state, stateSet] = React.useState({
    iName: iName,
    iContent: "",
    iEmail: iEmail,
    iReceiverName: "",
    iReceiverEmail: "",
  });

  // function render(iName) {
  function render(iName, iEmail) {
    if (Auth.loggedIn()) {
      console.log("In render, The current iName is" + iName);
      console.log("In render, The current iEmail is" + iEmail);

      //Display if messages exist
      if (data && data2) {
        console.log("AFTER data.iMessages.iName " + data.iMessages.iName);
        console.log("after if data check in render");
        return (
          <>
            {data.iMessages.map(
              ({
                id,
                iName: messageName,
                iReceiverName,
                iReceiverEmail,
                iDateCreated,
                iContent,
              }) => (
                <Container>
                  {console.log("iName is " + iName + " " + messageName)}
                  <div
                    className={
                      iName === messageName
                        ? "chatLayoutStart"
                        : "chatLayoutEnd"
                    }
                  >
                    {iName !== messageName && messageName !== null && (
                      <div className="chatLayoutName">
                        {messageName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    {iContent}
                    <br />
                    {iReceiverName} {iDateCreated}
                  </div>
                </Container>
              )
            )}
            {iChat(iName, iEmail, data2)}
          </>
        );
      } else {
        if (data2) iChat(iName, iEmail);
      }
    } else {
      return <h2>You need to be logged in to view this page</h2>;
    }
  }

  const iChat = (iName, iEmail, data2) => {
    // console.log("State name is " + state.iName);
    console.log("in iChat");

    // let options = selectOptions();
    let optionsEmail = [];
    let options = [];
    // let key = 0;

    options = [
      { key: 0, text: "Bruce", value: "Bruce" },
      { key: 1, text: "Pamela", value: "Pamela" },
      { key: 2, text: "Elijah", value: "Elijah" },
    ];

    optionsEmail = [
      "bruce@testmail.com",
      "pamela@testmail.com",
      "eholt@testmail.com",
    ];

    const onSend = () => {
      console.log("State content length is " + state.iContent.length);
      if (state.iContent.length > 0) {
        console.log(
          "State is " + state.iContent + " " + state.iEmail + " " + state.iName
        );
        postIMessage({
          variables: state,
        });
      }
      stateSet({
        ...state,
        iContent: "",
        iReceiverEmail: "",
        iReceiverName: "",
      });
    };
    return (
      <>
        <Container>
          <Form>
            <Form.Field>
              <Form.Input label="iName" value={iName} disabled />
            </Form.Field>
            <Form.Field>
              <Form.Input
                label="iContent"
                value={state.iContent}
                placeholder="Message"
                onChange={(evt) =>
                  stateSet({
                    ...state,
                    iName: iName,
                    iEmail: iEmail,
                    iContent: evt.target.value,
                  })
                }
                onKeyUp={(evt) => {
                  if (evt.keyCode === 13) {
                    onSend();
                  }
                }}
              />
            </Form.Field>
            <Form.Field>
              <Form.Select
                fluid
                label="Receiver Name"
                options={options}
                // options={data2.map((name, email) => {
                //   return {
                //     value: name,
                //     label: email,
                //   };
                // })}
                placeholder="Receiver Name"
                onChange={(evt) =>
                  stateSet({
                    ...state,
                    iReceiverName: evt.target.value,
                    iReceiverEmail: optionsEmail[0],
                  })
                }
              />
            </Form.Field>
            <Button onClick={() => onSend()}>Send</Button>
          </Form>
        </Container>
      </>
    );
  };

  return <div className="iMessenger">{render(iName, iEmail)}</div>;
}
