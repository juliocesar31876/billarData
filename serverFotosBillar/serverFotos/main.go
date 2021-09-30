package main

/////ejemplo server foto
import (
	"fmt"
	"io"
	"net/http"
	"os"
)

////Ejemplo de Server foto
func archivoExiste(ruta string, nombre string) string {
	////crea la carpeta si no existe
	if _, err := os.Stat(ruta); os.IsNotExist(err) {
		err = os.Mkdir(ruta, 0755)
		return nombre
	}
	return nombre
}
func guardarImagen(w http.ResponseWriter, r *http.Request) {
	///recibimos los parametros que nos manda
	fmt.Print("-----> Creando Imagen")

	nombre := r.FormValue("nombre")
	types := r.FormValue("type")
	err := r.ParseMultipartForm(200000)
	//cargando tamano
	if err != nil {
		fmt.Fprintln(w, err)

	}
	///extraemos el archivo y nombre
	file, handler, err := r.FormFile("image")
	nombreArchivo := handler.Filename
	if err != nil {
		fmt.Println("error retriving the file")
		fmt.Println(err)
		fmt.Println(nombreArchivo)
		return
	}
	defer file.Close()

	////creamos  el archivo en la direccion de la carpeta y el nombre
	path := "./imagenes/" + types
	carpeta := archivoExiste(path, types)
	resFile, err := os.Create("./imagenes/" + carpeta + "/" + nombre + ".png")
	if err != nil {
		fmt.Fprintln(w, err)
	}
	defer resFile.Close()
	io.Copy(resFile, file)
	defer resFile.Close()
}
func redirecionarImagen(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	var Nombre = query["nombre"][0]
	var Tipo = query["tipo"][0]
	var Path = "./imagenes/" + Tipo + Nombre + ".png"
	img, err := os.Open(Path)
	if err != nil {
		defer img.Close()
	}
	defer img.Close()
	w.Header().Set("Content-Type", "image/png") // <-- set the content-type header
	io.Copy(w, img)
}
func configuracionServerFotos() {
	fmt.Print("Iniciando servidor")
	////ponemos el puerto para recibir el archivo  y nombre
	http.HandleFunc("/serverFotos", guardarImagen)
	http.HandleFunc("/getImagen", redirecionarImagen)
	http.ListenAndServe(":4000", nil)
}
func main() {
	configuracionServerFotos()
}
