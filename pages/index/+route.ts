// Catch-all route: this page renders the react-router app for every URL.
// react-router (via basename + <Routes>) resolves the concrete page. The list
// of URLs to pre-render is provided by +onBeforePrerenderStart.
export default () => true;
