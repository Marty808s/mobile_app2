
export async function getPokemons() {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    //console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

// funkce pro získání detailu
export async function getDetails(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    //console.log("Detaily", result);
    return result;
  } catch (error) {
    console.error(error.message);
  }
}
