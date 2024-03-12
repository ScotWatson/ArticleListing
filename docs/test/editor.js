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

const DOM_PARSER = new self.DOMParser();
const XML_SERIALIZER = new self.XmlSerializer();

function protocolDropboxReadOnly({
  app_id,
  refresh_token,
}) {
  const protocol = {
    parameters: new Map(),
  };
  parameters.set("app_id", app_id);
  parameters.set("refresh_token", refresh_token);
  return protocol;
}

function start([ evtWindow ]) {
  try {
    const selfURL = new self.URL(window.location);
    const fragmentParams = new self.URLSearchParams(selfURL.hash.substring(1));
    const bootstrapUrl = fragmentParams.get("bootstrap");
    let users = new Map();
    let masterKey;  // 256-bit key
    if (bootstrapUrl === null) {
      masterKey = new self.Uint8Array(32);
      self.crypto.getRandomValues(masterKey);
      const masterKeyString = self.base64Encode(masterKey);
      users.set(masterKeyString, {
        key: masterKey,
        protocols: new Map(),
      });
    } else {
      fetch(bootstrapUrl).then(parseBootstrap);
      const masterKeyString = window.prompt("Enter key:");
      masterKey = self.base64Decode(masterKeyString);
      users.set(masterKeyString, {
        key: masterKey,
        protocols: new Map(),
      });
    }
    const btn = document.createElement("button");
    btn.textContent = "Dropbox - Read-Only";
    btn.addEventListener("click", function (evt) {
      
    });
    document.body.appendChild(btn);

    async function parseBootstrap(response) {
      if (response.status === 200) {
        throw "Error retrieving bootstrap file";
      }
      const contents = await response.text();
      const xml = DOM_PARSER.parseFromString(contents, "application/xml");
      const xmlVersion = xml.documentElement.getAttribute("version");
      if (xmlVersion === "") {
        throw "Missing version attribute";
      }
      if (xml.documentElement.name !== "bootstrap") {
        throw "bootstrap file must contain bootstrap";
      }
      switch (xmlVersion) {
        case "0Bdh5ULh": {
          parseBootstrap_0Bdh5ULh(xml);
        }
          break;
        default: {
          throw "Unrecognized bootstrap file version";
        }
      }
      async function saveBootstrap(users) {
        const protocolNames = new self.Set();
        for (const user of users.values()) {
          for (const protocol of user.protocols.values()) {
            const obj = {
              name: protocol.name,
              parameterNames: new Set();
            };
            Array.from(protocol.parameters.values());
            for (const parameter of  {
              obj.parameterNames.add(parameter.name);
            }
            protocolNames.add(obj);
          }
        }
        const bootstrapXML = document.implementation.createDocument(null, "bootstrap");
        bootstrapXML.documentElement.setAttribute("version", "0Bdh5ULh");
        const hashtestNode = bootstrapXML.createElement("hashtest");
        const usersArray = Array.from(users.values());
        usersArray.sort(function (a, b) {
          return (Math.random() < 0.5);
        });
        const salt = new self.Uint8Array(6);
        self.crypto.getRandomValues(salt);
        const saltString = await self.base64Encode(salt);
        hashtestNode.setAttribute("salt", saltString);
        for (const user of usersArray) {
          const saltedKey = await (new self.Blob([ user.key, salt ])).arrayBuffer();
          const hashedSaltedKey = await self.crypto.subtle.digest("SHA-256", saltedKey);
          const hashedSaltedKeyString = self.base64Encode(hashedSaltedKey);
          hashtestNode.textContent += " " + hashedSaltedKeyString;
        }
        hashtestNode.textContent += hashtestNode.textContent.substring(1);
        bootstrapXML.documentElement.appendChild(hashtestNode);
        for (const protocolName of protocolNames) {
          const protocolNode = bootstrapXML.createElement("protocol");
          protocolNode.setAttribute("name", protocol.name);
          protocolNode.setAttribute("type", protocol.type);
          for (const user of usersArray) {
            const protocol = user.protocols.get(protocolName);
            for (const parameter of protocol.parameters) {
              const parameterNode = bootstrapXML.createElement("parameter");
              parameterNode.setAttribute("name", parameter.name);
              parameterNode.setAttribute("type", parameter.type);
              switch (parameter.type) {
                case "public": {
                  parameterNode.textContent = parameter.value;
                }
                case "private": {
                  const iv = new Uint8Array(16);
                  const ivString = self.base64Encode(iv);
                  parameterNode.textContent = ivString;
                  for (const user of users) {
                    const value = parameter.value.get(user.key);
                    const key = await self.crypto.subtle.importKey("raw", user.key, {name: "AES-CBC"}, false, [ "encrypt" ]);
                    const encryptedValue = await self.crypto.subtle.encrypt({name: "AES-CBC", iv: iv}, key, value);
                    const encryptedValueString = await self.base64Encode(encryptedValue);
                    parameterNode.textContent += " " + encryptedValueString;
                  }
                }
                default: {
                  throw "Unrecognized parameter type";
                }
              }
              protocolNode.appendChild(parameterNode);
            }
          }
          bootstrapXML.documentElement.appendChild(protocolNode);
        }
        return XML_SERIALIZER.serializeToString(bootstrapXML);
      }
      async function parseBootstrap_0Bdh5ULh(bootstrapXML, users) {
        const masterKey = await self.base64Decode(masterKeyString);
        const hashedKey = await self.crypto.subtle.digest("SHA-256", masterKey);
        for (const node of xml.documentElement.childNodes) {
          switch (node.nodeName) {
            case "hashtest": {
              const saltString = node.getAttribute("salt");
              const salt = await self.base64Decode(saltString);
              const saltedKey = await (new self.Blob ([ masterKey, salt ])).arrayBuffer();
              const hashedSaltedKey = self.crypto.subtle.digest("SHA-256", saltedKey);
              const hashedSaltedKeyString = self.base64Encode(hashedSaltedKey);
              const hashStrings = node.textContent.split(" ");
              const userIndex = hashStrings.findIndexOf(hashedSaltedKeyString);
            }
              break;
            case "protocol": {
              const protocolName = node.getAttribute("name");
              const protocol = {
                name: protocolName,
                parameters: new self.Map(),
              };
              for (const parameterNode of node.childNodes) {
                const parameterName = parameter.getAttribute("name");
                const valueStrings = parameterNode.textContent.split(" ");
                const ivString = valueStrings.unshift(1);
                const iv = self.base64Decode(ivString);
                const encryptedValue = self.base64Decode(valueStrings[userIndex]);
                const key = await self.crypto.subtle.importKey("raw", masterkey, {name: "AES-CBC"}, false, [ "decrypt" ]);
                let value;
                try {
                  value = await self.crypto.subtle.decrypt({name: "AES-CBC", iv: iv}, key, encryptedValue);
                } catch (e) {
                  // Failed to decrypt
                }
                protocol.parameters.set(parameterName, value);
              }
            }
              break;
            default: {
              throw "Unrecognized node type";
            }
          }
        }
      }
    }
    const btnOpenClientFile = document.createElement("button");
    btnOpenClientFile.innerHTML = "Open Client File";
    document.body.appendChild(btnOpenClientFile);
    btnOpenClientFile.addEventListener("click", function (evt) {
      const inpFile = document.createElement("input");
      inpFile.type = "file";
      document.body.appendChild(inpFile);
      inpFile.click();
      inpFile.remove();
      parseClients(inpFile.files[0]);
    });
    document.createElement("table");
    async function parseClients(file) {
      const contents = await file.text();
      const xml = new self.DOMParser(contents);
      if (xml.documentElement.name !== "clients") {
        throw "client file must contain clients";
      }
      const xmlVersion = xml.documentElement.getAttribute("version");
      for (const clientNode of xml.documentElement.childNodes) {
        const divClient = document.createElement("div");
        switch (clientNode.name) {
          case "client": {
            const name = clientNode.getAttribute("name");
            divClient.append(name);
          }
          default: {
            // Unrecognized node
          }
        };
      }
    }
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
