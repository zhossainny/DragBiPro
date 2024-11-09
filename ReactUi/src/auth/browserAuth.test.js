import React from 'react';
import {BrowserAuth} from './browserAuth';
import sinon from 'sinon';


describe('AuthUtil tests', () => {

    beforeEach(()=> window.localStorage.clear());


    test('should set the cookie in session storage and remove from list of cookies', () => {
        sinon.stub(document,'cookie').get(()=>{
            return 'dd-token-ua=abcdefg;cookie2=value2';
        });

        let expectedCookieValue;

        sinon.stub(document,'cookie').set((value)=> expectedCookieValue = value);

        console.log(document.cookie);

        BrowserAuth.refreshAccessToken();

        expect(window.localStorage['dd-access-token-local']).toEqual('abcdefg');

        expect(expectedCookieValue).toEqual('dd-token-ua=abcdefg; Expires=Thu, 01 Jan 1970 00:00:00 GMT');


    });

    test('should skip setting the cookie in session storage if no cookie exists on document', ()=>{
        sinon.stub(document,'cookie').get(()=>{
            return 'xyz-cookie=abcdefg;cookie2=value2';
        });

        let setterSpy = sinon.spy();
        let setStub = sinon.stub(document,'cookie').set((value)=> {}).set(setterSpy);

        BrowserAuth.refreshAccessToken();

        expect(window.localStorage['dd-access-token-local']).toEqual(undefined);

        expect(setterSpy.called).toBe(false);
    });

});