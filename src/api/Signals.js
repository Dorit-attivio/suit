// @flow

import SearchDocument from './SearchDocument';

/**
 * Encapsulates the default Attivio search behavior.
 */
export default class Signals {
  baseUri: string;

  /**
   * Construct a Signals object.
   *
   * @param baseUri     the base URI for the Attivio instance to call when searching
   *                    (including the protocol, hostname or IP address, and port number,
   *                    with no trailing slash)
   */
  constructor(baseUri: string) {
    this.baseUri = baseUri;
  }

  /**
   * Add a signal for the given document. If the document has no signal information
   * inside it, this method does nothing.
   */
  addSignal(doc: SearchDocument, type: string = 'click', weight: number = 1) {
    if (doc.signal) {
      const uri = `${this.baseUri}/rest/signals/add`;
      const headers = new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      });
      const updatedSignal = Object.assign({}, doc.signal, { type, weight });
      const body = JSON.stringify(updatedSignal);
      const params = {
        method: 'POST',
        headers,
        body,
        credentials: 'include',
      };
      const fetchRequest = new Request(uri, params);

      fetch(fetchRequest).then(
        (response: Response) => {
          if (response.ok) {
            response.json().then(() => {
            }).catch((error: any) => {
              // Catch errors from converting the response's JSON
              console.log('Failed to submit signal', updatedSignal, error);
            });
          } else {
            // The request came back other than a 200-type response code
            const message = response.statusText ?
              `${response.statusText} (error code ${response.status})` :
              `Unknown error of type ${response.status}`;
            console.log('Failed to submit signal', updatedSignal, message);
          }
        },
        (error: any) => {
          // Catch network-type errors from the main fetch() call
          console.log('Failed to submit signal', updatedSignal, error);
        },
      ).catch((error: any) => {
        // Catch exceptions from the main "then" function
        console.log('Failed to submit signal', updatedSignal, error);
      });
    }
  }
}
