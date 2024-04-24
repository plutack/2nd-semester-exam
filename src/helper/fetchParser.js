export async function fetchData(url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          console.log(response)
          throw new Error('Network response was not ok');
        }
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
  