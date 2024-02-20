/*
(c) 2024 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const initPageTime = performance.now();

const asyncWindow = new Promise(function (resolve, reject) {
  window.addEventListener("load", function (evt) {
    resolve(evt);
  });
});

(async function () {
  try {
    const modules = await Promise.all( [ asyncWindow ] );
    start(modules);
  } catch (e) {
    console.error(e);
    throw e;
  }
})();

// Creates a GET Request to the specified endpoint
function createRequestGET(endpoint) {
  return new self.Request(endpoint, {
    method: "GET",
    headers: [],
    mode: "cors",
    credentials: "same-origin",
    cache: "default",
    redirect: "follow",
    referrer: "about:client",
    referrerPolicy: "",
    integrity: "",
    keepalive: "",
    signal: null,
    priority: "auto",
  });
}

function start([ evtWindow ]) {
  try {
    const urlThis = new self.URL(window.navigator.location);
    const paramsThis = urlThis.searchParams;
    let strTarget = paramsThis.get("url");
    while (!strTarget) {
      strTarget = window.prompt("Enter the target url: ");
    }
    let urlTarget = new self.URL(strTarget);
    let strKey;
    while (!strKey) {
      strKey = window.prompt("Enter the target key: ");
    }
    let rawKey = atob(strKey);
    conat bytesKey = new self.Uint8Array(rawKey.length);
    for (let i = 0; i < rawKey.length; ++i) {
      bytesKey[i] = rawKey.charCodeAt(i);
    }
    const requestTarget = createRequestGET(urlTarget);
    (async function () {
      const key = await self.crypto.importKey("raw", "AES-CBC", false, [ "decrypt" ]);
      const response = await fetch(requestTarget);
      if (response.status !== 200) {
        throw "Bad Location";
      }
      const bytesEncrypted = await response.arrayBuffer();
      const contentsView = new Uint8Array(contents);
      const iv = bytesEncrypted.slice(0, 16);
      const body = bytesEncrypted.slice(16);
      const bytesDecrypted = await self.crypto.decrypt({
        name: "AES-CBC",
        iv: iv,
      }, key, body);
      const DOMParser = new DOMParser();
      const UTF8Decoder = new TextDecoder();
      const strContents = UTF8Decoder.decode(bytesDecrypted);
      const xmlContent = DOMParser.parseFromString(strContents, "text/xml");
      console.log(xmlContent);
      for (const node of xmlContent.childNodes) {
        console.log(node);
      }
    })();
  } catch (e) {
    console.error(e);
  }
}
