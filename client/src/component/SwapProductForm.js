
import React, { Component, useEffect, useState } from 'react'
import { Button, Checkbox, Form , Dropdown, DropdownItem } from 'semantic-ui-react'
import { QUERY_ALL_ITEMS, QUERY_CATEGORIES } from '../utils/queries'
import { useQuery } from '@apollo/client';
import {ADD_MESSAGE} from '../utils/mutations';
import { useMutation } from '@apollo/client';
import { useNavigate } from "react-router-dom";

export default function SwapProductForm(props){
    const {productName, productOwner, productId,productOwnerId} = props;
    const [itemOfferId, setItemOfferId] = useState(0);
    const navigate = useNavigate();

    //console.log (productName, productOwner, productId, productOwnerId);
    const [addMessage] = useMutation(ADD_MESSAGE);

    //call graphql to get data this product
    //get this USERS PRODUCT ON DROPDOWN MENU
/*    const {loading, error, me } = useQuery(QUERY_ME);
    console.log('The current user is' + me);
    */
   // let me = "Bruce Lee";
    const {loading, error, data } = useQuery(QUERY_ALL_ITEMS);
    const me = {_id: "638fa971bf269d149534b90e"};
    var dropDownItems = [];
    if(data){
        var filteredItems = data.items.filter(
            (product) => product.owner._id === me._id
        );
        console.log(filteredItems);
        filteredItems.forEach(element => {
            dropDownItems.push(
                {
                    key: element._id,
                    text: element.name,
                    value: element._id,
                    id: element._id,
                    image: './images/'+element.image,
                  },
            );
        })
        console.log(dropDownItems);

   }



    //use mutation once complete the form 
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log('sender:' + me._id,  'receiver:'+productOwnerId, 'itemRequest: '+productId, 'itemOffer: '+itemOfferId);
        
        try {
          const mutationResponse = await addMessage({
            //variables: { email: formState.email, password: formState.password },
            //addMessage(sender: ID, receiver: ID, itemRequest: ID, itemOffer: ID ): Message
            variables:{sender: me._id, receiver:productOwnerId, itemRequest: productId, itemOffer: itemOfferId}
            });
            console.log(mutationResponse);
            console.log('message sent');
            alert('message sent');
            navigate("/");
            
        } catch (e) {
          console.log(e);
        }



      };

      const dropdownOnChange = (e, {value}) => {
        e.persist();
        console.log('Hi'+e.target.textContent + "value" + value);
        setItemOfferId(value);
      };


        
    return(
        <Form>
            <p>Product Name:{productName}</p>
            <p>Owner:{productOwner}</p>
            <Dropdown id="swapTo"
                placeholder='Swap with Your Product'
                fluid
                selection
                options={dropDownItems}
                onChange = {dropdownOnChange}>
            </Dropdown>

            
            <Button type='submit' onClick={handleFormSubmit} >Submit</Button>
        </Form>
    )
}

/*
      var Message;
      const TextOnChange = (e, {value}) => {
        e.persist();
        console.log('Hi'+e.target.value);
        Message=e.target.value;

      };

<Form.TextArea  id="Message" label='Message' placeholder='Tell us more how you would like to swap' onChange = {TextOnChange}/>
*/