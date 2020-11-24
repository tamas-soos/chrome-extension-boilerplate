import * as React from "react";
import * as ReactDOM from "react-dom";

import "../styles/popup.css";

function Hello() {
  const [state, setState] = React.useState(0);

  return (
    <div className="popup-padded">
      <h1>{chrome.i18n.getMessage("l10nHello")}</h1>
      <h1>state: {state}</h1>
      <button onClick={() => setState(state + 1)}>+1</button>
    </div>
  );
}

// --------------

ReactDOM.render(<Hello />, document.getElementById("root"));
