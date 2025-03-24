import React, { useState, useEffect } from "react";

// Componente principal de la galería
function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Fetch data from WordPress API - una sola vez al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://corrupcionaldia.com/wp-json/wp/v2/galeria-de-corruptos?_fields=acf,id,title&per_page=100"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data from WordPress");
        }

        const data = await response.json();

        // Transformar los datos al formato que necesita tu aplicación
        const formattedData = data
          .map((item) => {
            if (!item) return null;

            return {
              id: item.id || Math.random().toString(),
              name:
                item.acf?.nombre ||
                (item.title?.rendered ? item.title.rendered : "Sin nombre"),
              jobTitle: item.acf?.cargo || "Sin cargo",
              department: item.acf?.departamento || "Sin departamento",
              location: item.acf?.municipio || "Sin municipio",
              description: item.acf?.descripcion || "Sin descripción",
              imageUrl: item.acf?.foto || "https://placehold.co/300",
              moreInfoLink: item.acf?.enlace || null,
            };
          })
          .filter((item) => item !== null);

        setPhotos(formattedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Cargar datos solamente una vez al montar el componente
    fetchData();

    // No hay intervalos para recargar los datos
  }, []); // Array de dependencias vacío asegura que solo se ejecute una vez al montar

  // Añade una función para actualizar manualmente si es necesario
  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://corrupcionaldia.com/wp-json/wp/v2/galeria-de-corruptos?_fields=acf,id,title&per_page=100"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from WordPress");
      }

      const data = await response.json();

      const formattedData = data
        .map((item) => {
          if (!item) return null;

          return {
            id: item.id || Math.random().toString(),
            name:
              item.acf?.nombre ||
              (item.title?.rendered ? item.title.rendered : "Sin nombre"),
            jobTitle: item.acf?.cargo || "Sin cargo",
            department: item.acf?.departamento || "Sin departamento",
            location: item.acf?.municipio || "Sin municipio",
            description: item.acf?.descripcion || "Sin descripción",
            imageUrl: item.acf?.foto || "https://placehold.co/300",
          };
        })
        .filter((item) => item !== null);

      setPhotos(formattedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get all unique first letters from names
  const alphabet =
    photos.length > 0
      ? Array.from(
          new Set(photos.map((photo) => photo.name.charAt(0).toUpperCase()))
        ).sort()
      : [];

  // Filter photos based on search query and selected letter
  const filteredPhotos = photos
    .filter((photo) => {
      const matchesSearch = photo.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLetter = selectedLetter
        ? photo.name.charAt(0).toUpperCase() === selectedLetter
        : true;
      return matchesSearch && matchesLetter;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (loading && photos.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Cargando galería...</p>
      </div>
    );
  }

  if (error && photos.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Error: {error}</p>
        <p>Verifica que la API de WordPress esté configurada correctamente.</p>
        <button
          onClick={refreshData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Galería de Corruptos
      </h1>

      {/* Search and filter section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium">Filtrar por:</span>
            <button
              className={`px-3 py-1 text-sm rounded ${
                selectedLetter === null
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedLetter(null)}
            >
              Todos
            </button>
            {alphabet.map((letter) => (
              <button
                key={letter}
                className={`px-3 py-1 text-sm rounded ${
                  selectedLetter === letter
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedLetter(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Botón para actualización manual */}
        {/* <div className="flex justify-end">
          <button
            onClick={refreshData}
            disabled={loading}
            className={`px-4 py-2 rounded text-sm ${
              loading
                ? "bg-gray-300"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {loading ? "Actualizando..." : "Actualizar contenido"}
          </button>
        </div>*/}
      </div>

      {/* Gallery grid */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative h-64 w-full">
                <img
                  src={photo.imageUrl || "https://placehold.co/300"}
                  alt={photo.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{photo.name}</h3>
                <p className="text-gray-600">{photo.jobTitle}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No se encontraron registros que coincidan con tus criterios de
            búsqueda.
          </p>
        </div>
      )}

      {/* Photo detail modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-screen overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">{selectedPhoto.name}</h2>
              <button
                className="p-1 rounded-full hover:bg-gray-200"
                onClick={() => setSelectedPhoto(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedPhoto.imageUrl || "https://placehold.co/300"}
                    alt={selectedPhoto.name}
                    className="w-full h-auto object-cover rounded-md"
                  />
                </div>
                <div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Cargo:</span>{" "}
                      {selectedPhoto.jobTitle}
                    </div>
                    <div>
                      <span className="font-medium">Departamento:</span>{" "}
                      {selectedPhoto.department}
                    </div>
                    <div>
                      <span className="font-medium">Municipio:</span>{" "}
                      {selectedPhoto.location}
                    </div>
                    <div className="pt-4">
                      <span className="font-medium">Descripción:</span>
                      <p className="mt-2 text-gray-600">
                        {selectedPhoto.description}
                      </p>
                    </div>
                    {selectedPhoto.moreInfoLink && (
                      <div className="mt-4 flex justify-center">
                        <a
                          href={selectedPhoto.moreInfoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Más información
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;
