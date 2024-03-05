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
    const bytesKey = new Uint8Array(32);
    self.crypto.getRandomValues(bytesKey);
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    const btnSave = document.createElement("button");
    btnSave.innerHTML = "Save";
    document.body.appendChild(btnSave);
    btnSave.addEventListener("click", function (evt) {
      (async function () {
        const key = await self.crypto.subtle.importKey("raw", bytesKey, "AES-CBC", false, [ "encrypt" ]);
        const iv = new Uint8Array(16);
        self.crypto.getRandomValues(iv);
        const bytesDecrypted = await (new Blob([ textarea.value ], { type: "application/octet-stream" })).arrayBuffer();
        const bytesEncrypted = await self.crypto.subtle.encrypt({
          name: "AES-CBC",
          iv: iv,
        }, key, bytesDecrypted);
        const file = new Blob([ iv, bytesEncrypted ], { type: "application/octet-stream" });
        const urlFile = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = urlFile;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })();
    });
    const pKey = document.createElement("p");
    let rawKey = "";
    for (const byte of bytesKey) {
      rawKey += String.fromCharCode(byte);
    }
    pKey.innerHTML = btoa(rawKey);
    document.body.appendChild(pKey);
  } catch (e) {
    console.error(e);
  }
}
