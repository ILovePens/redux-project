(this["webpackJsonpredux-app"]=this["webpackJsonpredux-app"]||[]).push([[0],{16:function(t,e,n){t.exports={board_row:"Tictactoe_board_row__3rgFx",status:"Tictactoe_status__1yWkH",square:"Tictactoe_square__2FLKp",selected:"Tictactoe_selected__2J0dk",win:"Tictactoe_win__3iu36","kbd-navigation":"Tictactoe_kbd-navigation__1k7WA",game:"Tictactoe_game__1L0bM",game_info:"Tictactoe_game_info__3MppA",board:"Tictactoe_board__EHRYs",game_board:"Tictactoe_game_board__10zJy",moves:"Tictactoe_moves__1SQaE",scrollableY:"Tictactoe_scrollableY__Q9GYP"}},25:function(t,e,n){t.exports={row:"Counter_row__25RA2",value:"Counter_value__1LyDH",button:"Counter_button__1Mrat",textbox:"Counter_textbox__3xGUA",asyncButton:"Counter_asyncButton__24jSS Counter_button__1Mrat"}},26:function(t,e,n){t.exports={row:"Counter_row__-ob4V",value:"Counter_value__1mJ_F",button:"Counter_button__2N3Ru",textbox:"Counter_textbox__3t7Hj",asyncButton:"Counter_asyncButton__3xT0m Counter_button__2N3Ru"}},51:function(t,e,n){},58:function(t,e,n){},60:function(t,e,n){"use strict";n.r(e);var r=n(4),a=n.n(r),c=n(35),o=n.n(c),s=(n(51),n(62)),i=n(23),l=Object(i.a)(),u=n(1),d=n(2),b=n(27),p=n(6),f=n(7),j=function(){try{var t=localStorage.getItem("state");if(null===t)return;return JSON.parse(t)}catch(e){return}},h=function(t){try{var e=JSON.stringify(t);localStorage.setItem("state",e)}catch(n){console.log(n)}},O=n(3),v=function(t){Object(p.a)(n,t);var e=Object(f.a)(n);function n(){var t;Object(u.a)(this,n);for(var r=arguments.length,a=new Array(r),c=0;c<r;c++)a[c]=arguments[c];return(t=e.call.apply(e,[this].concat(a))).goToApp=function(e){e.preventDefault(),console.log(Object(b.a)(t));var n=t.pseudoInput.value;h(n),l.push("/redux-project/")},t}return Object(d.a)(n,[{key:"render",value:function(){var t=this;return Object(O.jsx)("div",{className:"connexionBox",onSubmit:function(e){return t.goToApp(e)},children:Object(O.jsxs)("form",{className:"connexion",children:[Object(O.jsx)("input",{type:"text",placeholder:"Pseudo",required:!0,ref:function(e){t.pseudoInput=e}}),Object(O.jsx)("button",{type:"submit",children:"GO"})]})})}}]),n}(a.a.Component),m=n(10),g=n(14),x=Object(g.c)({name:"nav",initialState:{},reducers:{reset:function(t){}}}),y=x.actions.reset,_=x.reducer;function C(t){return Object(O.jsxs)("label",{className:"switch",children:[Object(O.jsx)("input",{type:"checkbox",checked:t.isOn,onClick:t.onClick,readOnly:!0}),Object(O.jsx)("span",{className:"slider"})]})}function N(t){return Object(O.jsx)("button",{className:"reset",onClick:t.onClick,children:t.title})}function w(t){var e=Object(m.b)(),n=Object.keys(t.items).map((function(e,n){return Object(O.jsx)("button",{name:e,onClick:function(e){return t.handleClick(e)},children:e},n)}));return Object(O.jsxs)("header",{className:"App-header",children:[Object(O.jsx)("div",{className:"nav-items",children:n}),Object(O.jsx)(N,{title:"Reset all",onClick:function(){return e(y())}})]})}var k=n(20),S=n(8),A=n.n(S),I=n(13);function X(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return new Promise((function(e){return setTimeout((function(){return e({data:t})}),500)}))}var P=Object(g.b)("counter/fetchCount",function(){var t=Object(I.a)(A.a.mark((function t(e){var n;return A.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,X(e);case 2:return n=t.sent,t.abrupt("return",n.data);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),T=Object(g.c)({name:"counter",initialState:{value:0,status:"idle"},reducers:{increment:function(t){t.value+=1},decrement:function(t){t.value-=1},incrementByAmount:function(t,e){t.value+=e.payload},reset:function(t){t.value=0}},extraReducers:function(t){t.addCase(P.pending,(function(t){t.status="loading"})).addCase(P.fulfilled,(function(t,e){t.status="idle",t.value+=e.payload}))}}),F=T.actions,q=F.increment,B=F.decrement,M=F.incrementByAmount,G=F.reset,E=function(t){return t.counter.value},R=T.reducer,D=n(25),J=n.n(D);function L(){var t=Object(m.c)(E),e=Object(m.b)(),n=Object(r.useState)("2"),a=Object(k.a)(n,2),c=a[0],o=a[1],s=Number(c)||0;return Object(O.jsxs)("div",{children:[Object(O.jsxs)("div",{className:J.a.row,children:[Object(O.jsx)("button",{className:J.a.button,"aria-label":"Decrement value",onClick:function(){return e(B())},children:"-"}),Object(O.jsx)("span",{className:J.a.value,children:t}),Object(O.jsx)("button",{className:J.a.button,"aria-label":"Increment value",onClick:function(){return e(q())},children:"+"})]}),Object(O.jsxs)("div",{className:J.a.row,children:[Object(O.jsx)("input",{className:J.a.textbox,"aria-label":"Set increment amount",value:c,onChange:function(t){return o(t.target.value)}}),Object(O.jsx)("button",{className:J.a.button,onClick:function(){return e(M(s))},children:"Add Amount"}),Object(O.jsx)("button",{className:J.a.asyncButton,onClick:function(){return e(P(s))},children:"Add Async"}),Object(O.jsx)("button",{className:J.a.button,onClick:function(){return e((t=s,function(e,n){E(n())%2===1&&e(M(t))}));var t},children:"Add If Odd"}),Object(O.jsx)(N,{title:"Reset",onClick:function(){return e(G())}})]})]})}var Y={history:[{squares:Array(9).fill(null)}],winSquares:[],xIsNext:!0,stepNumber:0,sortIsAsc:!0},H=Object(g.c)({name:"tictactoe",initialState:Y,reducers:{handleClick:function(t,e){var n=t.history.slice(0,t.stepNumber+1),r=n[n.length-1].squares.slice();t.winSquares.length||r[e.payload]||(r[e.payload]=t.xIsNext?"X":"O",t.history=n.concat([{squares:r}]),t.stepNumber=n.length,t.xIsNext=!t.xIsNext)},jumpTo:function(t,e){t.stepNumber=e.payload,t.xIsNext=e.payload%2===0},toggleSort:function(t){t.sortIsAsc=!t.sortIsAsc},reset:function(t){t.history=[{squares:Array(9).fill(null)}],t.stepNumber=0}}}),z=H.actions,W=z.handleClick,Z=z.jumpTo,K=z.toggleSort,Q=z.reset,U=function(t){return t.tictactoe.history},V=function(t){return t.tictactoe.stepNumber},$=function(t){return t.tictactoe.xIsNext},tt=function(t){return t.tictactoe.sortIsAsc},et=H.reducer,nt=n(16),rt=n.n(nt);var at=function(t){var e="";return t.winSquares&&(e=t.winSquares.find((function(e){return e===t.index}))+1?" "+rt.a.win:""),Object(O.jsx)("button",{className:rt.a.square+e,onClick:t.onClick,children:t.value})},ct=function(t){Object(p.a)(n,t);var e=Object(f.a)(n);function n(){return Object(u.a)(this,n),e.apply(this,arguments)}return Object(d.a)(n,[{key:"renderSquare",value:function(t){var e=this;return Object(O.jsx)(at,{index:t,value:this.props.squares[t],onClick:function(){return e.props.onClick(t)},winSquares:this.props.winSquares},t)}},{key:"createBoard",value:function(){for(var t=[],e=-1,n=0;n<3;n++){for(var r=[],a=0;a<3;a++)e++,r.push(this.renderSquare(e));t.push(Object(O.jsx)("div",{className:rt.a.board_row,children:r},n))}return t}},{key:"render",value:function(){var t="undefined"===typeof this.props.isSelected,e=t?" "+rt.a.game_board:"",n=this.props.isSelected?" "+rt.a.selected:"",r=t?"":this.props.title;return Object(O.jsxs)("div",{children:[Object(O.jsx)("div",{className:rt.a.board+e+n,children:this.createBoard()}),Object(O.jsx)("p",{children:r})]})}}]),n}(a.a.Component);function ot(){var t=Object(m.b)(),e=Object(m.c)(U),n=Object(m.c)(V),r=e[n],a=function(t){for(var e=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],n=0;n<e.length;n++){var r=Object(k.a)(e[n],3),a=r[0],c=r[1],o=r[2];if(t[a]&&t[a]===t[c]&&t[a]===t[o])return e[n]}return[]}(r.squares),c=e.map((function(r,a){var c=a?"Move #"+a:"Game start",o=n===a;return Object(O.jsx)("li",{children:Object(O.jsx)(ct,{isSelected:o,squares:e[a].squares,onClick:function(){return t(Z(a))},title:c})},a)}));c=Object(m.c)(tt)?c:c.sort((function(t,e){return e.key-t.key}));var o,s=Object(m.c)($);return o=a.length?"Winner: "+(s?"O":"X"):9!==n||a.length?"Next player: "+(s?"X":"O"):"Draw!",Object(O.jsxs)("div",{className:rt.a.game,children:[Object(O.jsx)(ct,{squares:r.squares,winSquares:a,onClick:function(e){return t(W(e))}}),Object(O.jsxs)("div",{className:rt.a.game_info,children:[Object(O.jsx)("div",{children:o}),Object(O.jsx)(C,{onClick:function(){return t(K())}}),Object(O.jsx)(N,{title:"Reset",onClick:function(){return t(Q())}}),Object(O.jsx)("div",{className:rt.a.scrollableY,children:Object(O.jsx)("ol",{className:rt.a.moves,children:c})})]})]})}var st=n(5),it=n(44),lt=n(46),ut=Object(it.a)({apiKey:"AIzaSyDVe3axD8Y3GnxcnsnDuDz_FHCKYJcu6gg",authDomain:"redux-project-98a9a.firebaseapp.com",databaseURL:"https://redux-project-98a9a-default-rtdb.europe-west1.firebasedatabase.app/",projectId:"redux-project-98a9a",storageBucket:"redux-project-98a9a.appspot.com",messagingSenderId:"67646127878",appId:"1:67646127878:web:507ecc4c86993503ca2887",measurementId:"G-34QJSE84ZR"});Object(lt.a)(ut);function dt(){var t=Object(st.b)();return new Promise((function(e){Object(st.a)(Object(st.d)(t,"/players")).then((function(t){t.exists()?e(t.val()):console.log("No data available")})).catch((function(t){console.error(t)}))}))}function bt(t){var e=Object(st.b)();return new Promise((function(n){Object(st.a)(Object(st.d)(e,"/turnAction")).then((function(r){r.exists()?r.val()!==t&&Object(st.a)(Object(st.d)(e,"/")).then((function(t){t.exists()?n(t.val()):console.log("No data available")})).catch((function(t){console.error(t)})):console.log("No data available")})).catch((function(t){console.error(t)}))}))}function pt(){var t=Object(st.b)();return new Promise((function(e){Object(st.a)(Object(st.d)(t,"/players")).then((function(n){n.exists()?Object(st.a)(Object(st.d)(t,"/gameIsOn")).then((function(t){t.exists()?e({players:n.val(),gameIsOn:t.val()}):console.log("No data available")})).catch((function(t){console.error(t)})):console.log("No data available")})).catch((function(t){console.error(t)}))}))}var ft={history:[{slots:Array(42).fill(0),boardFlip:0}],turnAction:{number:0,action:0},stepNumber:0,gameSettings:{width:7,height:6,scoreTarget:4},nextPlayer:"X",sortIsAsc:!0,gravIsOn:!0,transitions:{slots:0,board:0},players:[]},jt=Object(g.b)("connectX/readPlayers",function(){var t=Object(I.a)(A.a.mark((function t(e,n){var r;return A.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,dt();case 2:return(r=t.sent)||(r=[]),Object.keys(r).length>2&&(n.dispatch(St()),n.dispatch(Et(j())),r=[]),t.abrupt("return",r);case 7:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()),ht=Object(g.b)("connectX/compareGameState",function(){var t=Object(I.a)(A.a.mark((function t(e){var n;return A.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,bt(e);case 2:return n=t.sent,t.abrupt("return",n);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),Ot=Object(g.b)("connectX/readGamePlayers",function(){var t=Object(I.a)(A.a.mark((function t(e,n){var r,a,c;return A.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,pt();case 2:return r=t.sent,a=r.players,1===(c=Object.keys(a).length)?Object(st.e)(Object(st.d)(Object(st.b)(),"/gameIsOn/"),!1):2===c&&(r.gameIsOn?n.dispatch(kt(!1)):n.dispatch(kt(!0))),c>2&&(n.dispatch(St()),n.dispatch(Et(j())),a=[]),t.abrupt("return",a);case 8:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()),vt=Object(g.c)({name:"connectX",initialState:ft,reducers:{fillSlot:function(t,e){var n=e.payload,r=n.stepNumber,a=n.history,c=n.current,o=n.slots,s=n.slotIndex,i=t.nextPlayer;o[s]=i;var l=t.turnAction;l.action||r++,t.stepNumber=r;var u=l.number+1===2,d=!t.gravIsOn;if(u&&d?(t.turnAction={number:0,action:0},t.nextPlayer="X"===i?"O":"X"):(t.turnAction.number+=1,t.turnAction.action=1),a=a.slice(0,r),t.history=a.concat([{slots:o,boardFlip:c.boardFlip}]),d&&(t.transitions={slots:0,board:0}),t.players&&2===t.players.length&&d){console.log("set db fillSlot");var b=Object(st.b)(),p=Object(st.d)(b,"/history/".concat(r));Object(st.e)(p,{slots:o,boardFlip:c.boardFlip}),u&&(p=Object(st.d)(b,"/stepNumber/"),Object(st.e)(p,r),p=Object(st.d)(b,"/nextPlayer/"),Object(st.e)(p,t.nextPlayer)),p=Object(st.d)(b,"/turnAction/"),Object(st.e)(p,t.turnAction.number),p=Object(st.d)(b,"/transitions/"),Object(st.e)(p,t.transitions)}},toggleGravity:function(t,e){var n,r=e.payload.slotIndex,a="undefined"!==typeof r,c=t.stepNumber,o=t.history.slice(0,c+1),s=o[c],i=s.slots.slice(),l=e.payload.toggle,u=t.turnAction;l?(t.gravIsOn=!t.gravIsOn,n=u.number+1===2):n=2===u.number;var d=t.gravIsOn;if(d){var b=t.gameSettings.width,p=t.gameSettings.height;s.boardFlip%2!==0&&(b=t.gameSettings.height,p=t.gameSettings.width);var f=1;if(a){for(var j=0,h=p-1;h>0;h--)if(r>=(h-1)*b&&r<=h*b-1){j=p-h;break}f=j}for(var O=Array(b*p).fill(0),v=i.length-1-f*b;v>=0;v-=b){for(var m=0;m<b;m++){var g=v-m;if(i[g]&&(!a||r===g)){for(var x=f;x>0;x--){var y=g+b*x;if(!i[y]){i[y]=i[g],i[g]=0,O[y]=x;break}}if(r===g)break}}if(a)break;f++}}u.action||c++,t.stepNumber=c,n?(t.turnAction={number:0,action:0},t.nextPlayer="X"===t.nextPlayer?"O":"X"):(t.turnAction.number=l?u.number+1:u.number,t.turnAction.action=l?2:u.action),o=o.slice(0,c),t.history=o.concat([{slots:i,boardFlip:s.boardFlip}]);var _=!!(O&&O.filter((function(t){return 0!==t})).length>0);if(t.transitions={slots:d&&_?O:0,board:l||3!==u.action?0:t.transitions.board},t.players&&2===t.players.length){console.log("set db toggleGravity");var C=Object(st.b)(),N=Object(st.d)(C,"/gravIsOn/");Object(st.e)(N,d),N=Object(st.d)(C,"/history/".concat(c)),Object(st.e)(N,{slots:i,boardFlip:s.boardFlip}),n&&(N=Object(st.d)(C,"/stepNumber/"),Object(st.e)(N,c),N=Object(st.d)(C,"/nextPlayer/"),Object(st.e)(N,t.nextPlayer)),N=Object(st.d)(C,"/turnAction/"),Object(st.e)(N,t.turnAction.number),N=Object(st.d)(C,"/transitions/"),Object(st.e)(N,t.transitions)}},flipBoardState:function(t,e){var n=t.stepNumber,r=t.history.slice(0,n+1),a=r[n],c=a.slots.slice(),o=e.payload,s=a.boardFlip+o;-1===s&&(s=3),4===s&&(s=0);var i=t.gameSettings.width,l=t.gameSettings.height;a.boardFlip%2!==0&&(i=t.gameSettings.height,l=t.gameSettings.width);for(var u=c.slice(),d=l,b=c.length-1;b>=0;b-=i){for(var p=0;p<i;p++){var f=b-p;u[1===o?l*(f+1-(d-1)*i)-d:l*(d*i-1-f)+d-1]=c[f]}d--}var j=t.turnAction;j.action||n++,t.stepNumber=n;var h=j.number+1===2,O=!t.gravIsOn;if(h&&O?(t.turnAction={number:0,action:0},t.nextPlayer="X"===t.nextPlayer?"O":"X"):(t.turnAction.number+=1,t.turnAction.action=3),r=r.slice(0,n),t.history=r.concat([{slots:u,boardFlip:s}]),t.transitions={slots:0,board:-90*o},t.players&&2===t.players.length&&O){console.log("set db flipBoard");var v=Object(st.b)(),m=Object(st.d)(v,"/history/".concat(n));Object(st.e)(m,{slots:u,boardFlip:s}),h&&(m=Object(st.d)(v,"/stepNumber/"),Object(st.e)(m,n),m=Object(st.d)(v,"/nextPlayer/"),Object(st.e)(m,t.nextPlayer)),m=Object(st.d)(v,"/turnAction/"),Object(st.e)(m,t.turnAction.number),m=Object(st.d)(v,"/transitions/"),Object(st.e)(m,t.transitions)}},endTurn:function(t){var e={number:0,action:0};t.turnAction=e,t.nextPlayer="X"===t.nextPlayer?"O":"X";var n={slots:0,board:0};if(t.transitions=n,t.players&&2===t.players.length){console.log("set db endTurn");var r=Object(st.b)(),a=Object(st.d)(r,"/turnAction/");Object(st.e)(a,e.number),a=Object(st.d)(r,"/nextPlayer/"),Object(st.e)(a,t.nextPlayer),a=Object(st.d)(r,"/transitions/"),Object(st.e)(a,n)}},changeStep:function(t,e){t.stepNumber=e.payload,t.nextPlayer=t.stepNumber%2===0?"X":"O",t.turnAction={number:0,action:0},t.transitions={slots:0,board:0}},toggleSort:function(t){t.sortIsAsc=!t.sortIsAsc,t.transitions={slots:0,board:0}},setGameSettings:function(t,e){var n=e.payload;t.gameSettings=n,t.history=[{slots:Array(n.width*n.height).fill(0),boardFlip:0}]},reset:function(t,e){var n=e.payload,r=t.history.slice(0,1);r[0].boardFlip=0;var a={slots:0,board:0};if(n){var c=Object(st.b)(),o=Object(st.d)(c,"/stepNumber/");Object(st.e)(o,0),o=Object(st.d)(c,"/history/"),Object(st.e)(o,r),o=Object(st.d)(c,"/turnAction/"),Object(st.e)(o,0),o=Object(st.d)(c,"/nextPlayer/"),Object(st.e)(o,"X"),o=Object(st.d)(c,"/transitions/"),Object(st.e)(o,a),o=Object(st.d)(c,"/gravIsOn/"),Object(st.e)(o,!0),o=Object(st.d)(c,"/gameIsOn/"),Object(st.e)(o,!0)}t.stepNumber=0,t.history=r,t.nextPlayer="X",t.turnAction={number:0,action:0},t.transitions=a,t.gravIsOn=!0},removePlayers:function(t){var e=Object(st.b)();Object(st.e)(Object(st.d)(e,"/players/"),0)}},extraReducers:function(t){t.addCase(ht.pending,(function(t){console.log("updateStateAsync pending")})).addCase(ht.fulfilled,(function(t,e){var n=e.payload;if(console.log("updateStateAsync",n),null===n)window.alert("Your opponent left! Reload the page to exit the current game"),t.players=[];else{t.history=n.history,t.stepNumber=n.stepNumber;var r=n.transitions;t.transitions={slots:r.slots,board:r.board},t.gravIsOn=n.gravIsOn;var a=n.turnAction;t.turnAction.number=2===a?0:a}})).addCase(Ot.pending,(function(t){console.log("requestGameAsync pending")})).addCase(Ot.fulfilled,(function(t,e){var n=e.payload;console.log("requestGameAsync",n);var r=Object.keys(n);0===r.length||(1===r.length?(t.players=[{pseudo:n[r[0]].pseudo,sign:"O"}],t.transitions={slots:0,board:0}):2===r.length&&(t.players=[{pseudo:n[r[0]].pseudo,sign:"O"},{pseudo:n[r[1]].pseudo,sign:"X"}]))})).addCase(jt.pending,(function(t){console.log("initPlayersAsync pending")})).addCase(jt.fulfilled,(function(t,e){var n=e.payload;console.log("initPlayersAsync",n);var r=Object.keys(n);0===r.length?t.players=null:1===r.length?t.players=[{pseudo:n[r[0]].pseudo,sign:"O"}]:2===r.length&&(t.players=[{pseudo:n[r[0]].pseudo,sign:"O"},{pseudo:n[r[1]].pseudo,sign:"X"}])}))}}),mt=vt.actions,gt=mt.fillSlot,xt=mt.changeStep,yt=mt.toggleSort,_t=mt.toggleGravity,Ct=mt.flipBoardState,Nt=mt.endTurn,wt=mt.setGameSettings,kt=mt.reset,St=mt.removePlayers,At=function(t){return t.connectX.history},It=function(t){return t.connectX.gameSettings},Xt=function(t){return t.connectX.stepNumber},Pt=function(t){return t.connectX.sortIsAsc},Tt=function(t){return t.connectX.gravIsOn},Ft=function(t){return t.connectX.transitions},qt=function(t){return t.connectX.nextPlayer},Bt=function(t){return t.connectX.players},Mt=function(t){return t.connectX.turnAction},Gt=function(t){return function(e,n){e(Ct(t)),Tt(n())&&e(_t({toggle:!1}))}},Et=function(t){return function(e,n){Object(st.e)(Object(st.c)(Object(st.d)(Object(st.b)(),"players")),{pseudo:t}).then((function(){e(Ot());var t=setInterval((function(){Bt(n()).length<2?e(Ot()):clearInterval(t)}),4e3)})).catch((function(t){}))}},Rt=vt.reducer,Dt=n(9),Jt=n.n(Dt);var Lt=function(t){var e=t.slotScore,n="",r=0;e&&(n="hasTransition ".concat(Jt.a.fall),r=Math.round(10*(.16+.189*Math.log(e)))/10);var a=t.value?"".concat(Jt.a.slotContent," ").concat("X"===t.value?Jt.a.slotContentX:Jt.a.slotContentO):"",c=t.winStyle?"wonSlot":"";return Object(O.jsx)("button",{className:"".concat(Jt.a.slot," ").concat(c),onClick:t.onClick,children:Object(O.jsx)("div",{style:{"--slotStartPos":"calc(".concat(-1*e*125,"% + ").concat(e,"px)"),"--speed":"".concat(r,"s")},className:"".concat(a," ").concat(n),onTransitionEnd:t.handleTransitionEnd})})};function Yt(){var t=Array.from(document.querySelectorAll(".wonSlot"));console.log(t),t.forEach((function(t){t.classList.add(Jt.a.win)}))}var Ht=function(t){Object(p.a)(n,t);var e=Object(f.a)(n);function n(){var t;Object(u.a)(this,n);for(var r=arguments.length,a=new Array(r),c=0;c<r;c++)a[c]=arguments[c];return(t=e.call.apply(e,[this].concat(a))).handleTransitionEnd=function(e){t.props.winIndexes.length&&Yt()},t.renderSlot=function(e,n,r){var a,c=n?void 0:function(){return t.props.onClick(e)},o=n?t.props.winIndexes:null,s=!(!o||!o.includes(e)),i=0;if(r&&(i=r,s)){var l=t.props.transitions.slots,u=l.filter((function(t){return 0!==t})).sort((function(t,e){return e-t}))[0];e===l.findIndex((function(t){return t===u}))&&(a=function(e){return t.handleTransitionEnd(e)})}return Object(O.jsx)(Lt,{value:t.props.slots[e],onClick:c,slotScore:i,winStyle:s,handleTransitionEnd:a},e)},t.createBoard=function(e,n,r){for(var a=[],c=0,o=t.props.transitions,s=o?t.props.transitions.slots:null,i=0,l=0;l<e.height;l++){for(var u=[],d=0;d<e.width;d++)s&&(i=s[c]),u.push(t.renderSlot(c,r,i)),c++;a.push(Object(O.jsx)("div",{className:Jt.a.board_row,children:u},l))}var b=o?t.props.transitions.board:0;return Object(O.jsx)("div",{style:{"--boardStartPos":"rotateZ(".concat(b,"deg)")},className:"\n              ".concat(0===b?"":"hasTransition ".concat(Jt.a.flip)," \n              ").concat(Jt.a.board," \n              ").concat(n?Jt.a.main_board:""," \n              ").concat(t.props.isSelected?Jt.a.selected:"","\n            "),onTransitionEnd:n&&r?function(){return t.handleTransitionEnd()}:void 0,children:a})},t.styleBoard=function(t,e){var n=Math.floor(.55*window.innerHeight/(e.height*t)),r=Math.floor(.55*window.innerHeight/(e.width*t));n=n<=r?n:r;var a=Math.round(e.height/130*10)/10;return a<=.5&&(a=0),{"--boardWidth":n*e.width+"px","--boardHeight":n*e.height+"px","--slotSize":n+1+"px","--fontSize":a+"em"}},t}return Object(d.a)(n,[{key:"componentDidUpdate",value:function(){var t=this.props.transitions;this.props.isMainBoard&&(t&&(t.slots||t.board)?Array.from(document.querySelectorAll(".hasTransition")).forEach((function(t){t.classList.remove(Jt.a.animate),setTimeout((function(){t.classList.add(Jt.a.animate)}),0)})):this.props.winIndexes.length&&Yt())}},{key:"render",value:function(){var t=this.props.boardParams;this.props.flip%2!==0&&(t={width:t.height,height:t.width});var e=this.props.isMainBoard,n=e?"":this.props.title,r=!(!e||!this.props.winIndexes.length);return Object(O.jsxs)("div",{style:e?this.styleBoard(1,t):this.styleBoard(4,t),className:e?Jt.a.main:"",children:[this.createBoard(t,e,r),Object(O.jsx)("p",{className:Jt.a.title,children:n})]})}}]),n}(a.a.Component),zt=function(t){Object(p.a)(n,t);var e=Object(f.a)(n);function n(){var t;Object(u.a)(this,n);for(var r=arguments.length,a=new Array(r),c=0;c<r;c++)a[c]=arguments[c];return(t=e.call.apply(e,[this].concat(a))).prepareInfos=function(e){e.preventDefault();var n=parseInt(t.width.value),r=parseInt(t.height.value),a=n<=r?n:r,c=Math.round(.8+1.7*Math.log((n+r)/2)),o={width:n,height:r,scoreTarget:a<=c?a:c};t.props.sendGameSettings(o),t.infosForm.reset()},t}return Object(d.a)(n,[{key:"render",value:function(){var t=this;return Object(O.jsxs)("form",{className:Jt.a.form,onSubmit:function(e){return t.prepareInfos(e)},ref:function(e){return t.infosForm=e},children:[Object(O.jsx)("input",{type:"text",pattern:"\\b([3-9]|[12][0-9]|3[0-2])\\b",maxLength:this.props.length,ref:function(e){return t.width=e}}),Object(O.jsx)("input",{type:"text",pattern:"\\b([3-9]|[12][0-9]|3[0-2])\\b",maxLength:this.props.length,ref:function(e){return t.height=e}}),Object(O.jsx)("button",{type:"submit",children:"Envoyer!"})]})}}]),n}(a.a.Component);function Wt(t){var e=Object(m.b)(),n=Object(m.c)(At),r=Object(m.c)(Xt),a=n[r].slots,c=Object(m.c)(Mt),o=Object(m.c)(Bt),s=t.pseudo,i=Object(O.jsx)(zt,{sendGameSettings:function(t){return e((n=t,function(t){t(kt()),t(wt(n))}));var n}}),l=Object(O.jsx)("button",{onClick:function(){return e(Et(s))},children:"Request game"}),u=null,d=Object(O.jsx)(N,{title:"Reset",onClick:function(){return e(kt())}}),b=Object(O.jsxs)("div",{children:[Object(O.jsx)("button",{onClick:function(){return e(Gt(1))},children:"Flip right"}),Object(O.jsx)("button",{onClick:function(){return e(Gt(-1))},children:"Flip left"}),Object(O.jsx)(C,{isOn:!Object(m.c)(Tt),onClick:function(){return e(_t({toggle:!0}))}})]}),p=Object(O.jsxs)("div",{children:[Object(O.jsx)("button",{className:Jt.a.disabled,onClick:function(){},children:"Flip right"}),Object(O.jsx)("button",{className:Jt.a.disabled,onClick:function(){},children:"Flip left"}),Object(O.jsx)(C,{className:Jt.a.disabled,isOn:!Object(m.c)(Tt),onClick:function(){}})]}),f=function(t){return e((n=t,function(t,e){var r=Xt(e()),a=At(e()).slice(0,r+1),c=a[r],o=c.slots.slice(),s=Tt(e());o[n]||(t(gt({stepNumber:r,history:a,current:c,slots:o,slotIndex:n,gravIsOn:s})),s&&t(_t({toggle:!1,slotIndex:n})))}));var n},j=Object(m.c)(qt);if(console.log("players",o),o&&o.length>0){var h=o.length;console.log("playerCount",h);var v=o.find((function(t){return t.pseudo===s})),g=void 0!==v;if(console.log("myplayer",v),g){var x=1===h,y=2===h;if((x||y)&&(console.log("waitingForGame",x),window.onunload=function(t){e(St())},l=null),y){var _=v.sign===j;console.log(_),_||(e((function(t,e){var n=setInterval((function(){2===Bt(e()).length?t(ht(Mt(e()).number)):clearInterval(n)}),4e3)})),f=function(){},b=p),i=null,d=null}}else{(2===h||g)&&(l=null)}}else o&&0===o.length&&(console.log("am i crazy",o),e(function(t){return function(e){console.log("hey call to async",t),t&&e(jt())}}(o)));c.number&&(1===c.action?(f=function(){},u=Object(O.jsx)("button",{onClick:function(){return e(Nt())},children:"End turn"})):b=p);var w=Object(m.c)(It),k=n[r].boardFlip,S={width:w.width,height:w.height},A=Object(m.c)(Ft),I=[],X=w.scoreTarget;if(r>=2*X-1){var P=k%2===0?S.width:S.height;I=function(t,e,n,r){var a=[],c=[],o=[];for(var s in e)e[s]!==t[s]&&o.push(parseInt(s));for(var i=o.length-1;i>=0;i--){var l=o[i];if(!c.includes(l)){for(var u=e[l],d=0,b=l;b>l-n&&e[b-1]&&e[b-1]===u&&b%r!==0;b--)d++,a.push(b-1);for(var p=0,f=l;f<l+n&&e[f+1]&&e[f+1]===u&&(f+1)%r!==0;f++)p++,a.push(f+1);d+p>=n-1&&(a.push(l),c=c.concat(a)),a=[];for(var j=0,h=l;h>l-n*r&&e[h-r]&&e[h-r]===u;h-=r)j++,a.push(h-r);for(var O=0,v=l;v<l+n*r&&e[v+r]&&e[v+r]===u;v+=r)O++,a.push(v+r);j+O>=n-1&&(a.push(l),c=c.concat(a)),a=[];for(var m=0,g=l;g>l-n*(r+1)&&e[g-r-1]&&e[g-r-1]===u&&g%r!==0;g-=r+1)m++,a.push(g-r-1);for(var x=0,y=l;y<l+n*(r+1)&&e[y+r+1]&&e[y+r+1]===u&&(y+1)%r!==0;y+=r+1)x++,a.push(y+r+1);m+x>=n-1&&(a.push(l),c=c.concat(a)),a=[];for(var _=0,C=l;C>l-n*(r-1)&&e[C-r+1]&&e[C-r+1]===u&&(C+1)%r!==0;C-=r-1)_++,a.push(C-r+1);for(var N=0,w=l;w<l+n*(r-1)&&e[w+r-1]&&e[w+r-1]===u&&w%r!==0;w+=r-1)N++,a.push(w+r-1);_+N>=n-1&&(a.push(l),c=c.concat(a)),a=[]}}return c}(n[r-1].slots,a,X,P)}var T,F=n.map((function(t,a){var c=a?"Move #"+a:"Game start",o=r===a,s=a===n.length-1;return Object(O.jsx)("li",{children:Object(O.jsx)(Ht,{boardParams:S,isSelected:o,slots:n[a].slots,transitions:s?A:null,flip:n[a].boardFlip,onClick:function(){return e(function(t){return function(e,n){Bt(n()).length<2&&(e(xt(t)),Tt(n())&&e(_t({toggle:!1})))}}(a))},title:c})},a)})),q=Object(m.c)(Pt);if(F=q?F:F.sort((function(t,e){return e.key-t.key})),I.length){var B=0;I.forEach((function(t){"X"===a[t]&&B++})),T=B>I.length-B?"Winner: X":B<I.length-B?"Winner: O":"Draw!"}else T=I.length||r!==a.length?"Next player: "+j:"Draw!";return Object(O.jsxs)("div",{className:Jt.a.game,children:[i,Object(O.jsx)(Ht,{isMainBoard:!0,boardParams:S,slots:a,transitions:A,flip:k,winIndexes:I,onClick:function(t){return f(t)}}),Object(O.jsxs)("div",{className:Jt.a.game_info,children:[Object(O.jsx)("div",{className:Jt.a.status,children:T}),Object(O.jsxs)("div",{className:Jt.a.controls,children:[l,b,Object(O.jsx)(C,{isOn:!q,onClick:function(){return e(yt())}}),u,d]}),Object(O.jsx)("div",{className:Jt.a.scrollableY,children:Object(O.jsx)("ol",{className:Jt.a.moves,children:F})})]})]})}function Zt(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return new Promise((function(e){return setTimeout((function(){return e({data:t})}),500)}))}var Kt=Object(g.b)("counter/fetchCount",function(){var t=Object(I.a)(A.a.mark((function t(e){var n;return A.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Zt(e);case 2:return n=t.sent,t.abrupt("return",n.data);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),Qt=Object(g.c)({name:"counter",initialState:{value:0,status:"idle"},reducers:{increment:function(t){t.value+=1},decrement:function(t){t.value-=1},incrementByAmount:function(t,e){t.value+=e.payload}},extraReducers:function(t){t.addCase(Kt.pending,(function(t){t.status="loading"})).addCase(Kt.fulfilled,(function(t,e){t.status="idle",t.value+=e.payload}))}}),Ut=Qt.actions,Vt=Ut.increment,$t=Ut.decrement,te=Ut.incrementByAmount,ee=function(t){return t.counter.value},ne=(Qt.reducer,n(26)),re=n.n(ne);function ae(){var t=Object(m.c)(ee),e=Object(m.b)(),n=Object(r.useState)("2"),a=Object(k.a)(n,2),c=a[0],o=a[1],s=Number(c)||0;return Object(O.jsxs)("div",{children:[Object(O.jsxs)("div",{className:re.a.row,children:[Object(O.jsx)("button",{className:re.a.button,"aria-label":"Decrement value",onClick:function(){return e($t())},children:"-"}),Object(O.jsx)("span",{className:re.a.value,children:t}),Object(O.jsx)("button",{className:re.a.button,"aria-label":"Increment value",onClick:function(){return e(Vt())},children:"+"})]}),Object(O.jsxs)("div",{className:re.a.row,children:[Object(O.jsx)("input",{className:re.a.textbox,"aria-label":"Set increment amount",value:c,onChange:function(t){return o(t.target.value)}}),Object(O.jsx)("button",{className:re.a.button,onClick:function(){return e(te(s))},children:"Add Amount"}),Object(O.jsx)("button",{className:re.a.asyncButton,onClick:function(){return e(Kt(s))},children:"Add Async"}),Object(O.jsx)("button",{className:re.a.button,onClick:function(){return e((t=s,function(e,n){ee(n())%2===1&&e(te(t))}));var t},children:"Add If Odd Tbd"})]})]})}n(58);var ce=function(t){Object(p.a)(n,t);var e=Object(f.a)(n);function n(){var t;return Object(u.a)(this,n),(t=e.call(this)).state={items:{Counter:L,TicTacToe:ot,ConnectX:Wt,Tbd:ae},itemSelected:null,userPseudo:""},t.handleClick=t.handleClick.bind(Object(b.a)(t)),t}return Object(d.a)(n,[{key:"componentDidMount",value:function(){var t=this.state.userPseudo;console.log("componentDidMount",t),t||(t=j(),console.log("pseudo after loadState",t),t||(t=""),this.setState({userPseudo:t}),t||l.push("/redux-project/login"));var e=.01*window.innerHeight;document.documentElement.style.setProperty("--vh","".concat(e,"px"))}},{key:"handleClick",value:function(t){this.setState({itemSelected:t.target.name})}},{key:"render",value:function(){var t=this.state.userPseudo;console.log("render",t);var e=this.state.itemSelected?a.a.createElement(this.state.items[this.state.itemSelected],{pseudo:t}):null;return Object(O.jsxs)("div",{className:"App",children:[Object(O.jsx)(w,{items:this.state.items,handleClick:this.handleClick}),Object(O.jsx)("div",{className:"main",children:e})]})}}]),n}(r.Component),oe=function(){return Object(O.jsx)("h2",{className:"notFound",children:"Nothing to see here"})},se=n(18),ie=n(21),le=Object(ie.b)({nav:_,counter:R,tictactoe:et,connectX:Rt}),ue=Object(g.d)({serializableCheck:!1}),de=Object(g.a)({reducer:function(t,e){return"nav/reset"===e.type&&(t=void 0),le(t,e)},middleware:Object(se.a)(ue)}),be="/redux-project";o.a.render(Object(O.jsx)(a.a.StrictMode,{children:Object(O.jsx)(m.a,{store:de,children:Object(O.jsx)(s.b,{history:l,children:Object(O.jsxs)(s.c,{children:[Object(O.jsx)(s.a,{exact:!0,path:"".concat(be,"/login"),component:v}),Object(O.jsx)(s.a,{path:"".concat(be),component:ce}),Object(O.jsx)(s.a,{path:"".concat(be,"/"),component:oe})]})})})}),document.getElementById("root"))},9:function(t,e,n){t.exports={game:"ConnectX_game__1x_fZ",form:"ConnectX_form__34LiB",main:"ConnectX_main__6vhcL",main_board:"ConnectX_main_board__1BL24",title:"ConnectX_title__2bStg",board:"ConnectX_board__3OnTo",board_row:"ConnectX_board_row__CsIJA",slot:"ConnectX_slot__25hJA",slotContent:"ConnectX_slotContent__GfqZP",slotContentX:"ConnectX_slotContentX__18XTw",slotContentO:"ConnectX_slotContentO__1evBh",win:"ConnectX_win__X-N9o",scaleAnim:"ConnectX_scaleAnim__3zEhe",game_info:"ConnectX_game_info__2JF9V",controls:"ConnectX_controls__ekhdW",status:"ConnectX_status__2MWFR",moves:"ConnectX_moves__1ki_t",selected:"ConnectX_selected__1Puyt","kbd-navigation":"ConnectX_kbd-navigation__35g11",scrollableY:"ConnectX_scrollableY__1Mm7t",flipR:"ConnectX_flipR__2HwCv",animate:"ConnectX_animate__3ZyN7",flip:"ConnectX_flip__2PQK3",fall:"ConnectX_fall__13rRa"}}},[[60,1,2]]]);
//# sourceMappingURL=main.70b0c96b.chunk.js.map