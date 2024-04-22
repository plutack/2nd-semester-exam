export function fetchData(url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Consume the response stream and parse JSON
        return response.json();
      })
      .then(data => {
        // Return the parsed JSON data
        return data;
      })
      .catch(error => {
        // Handle errors
        console.error('There was a problem with the fetch operation:', error);
        throw error;
      });
  }
  