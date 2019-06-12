console.log('before render');
console.log(window.location.href);
if (window.performance.navigation.type === 2) {
    //window.location.reload(true);
    console.log('reload');
    window.open('localhost:4000/a', '_self');
}
  