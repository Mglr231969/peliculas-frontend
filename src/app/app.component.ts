import { Component, OnInit } from "@angular/core";
import { EndpointsService } from "src/core/services/endpoints";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'proyecto-peliculas-front';
  movieForm: FormGroup;
  isEditMode = false;

  movies: any[] = [];
  selectedMovie: any;
  modalTitle: string = 'Añadir Película';

  constructor(private fb: FormBuilder, private enpoints: EndpointsService,) {
    this.movieForm = this.fb.group({
      namemovie: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getPeliculas();
  }

  onSubmit() {
    if (this.movieForm.valid) {
      const movieData = this.movieForm.value;
      if (this.selectedMovie) {
        // Estás editando, realiza una solicitud PATCH
        this.enpoints.PeliculaUpdate(this.selectedMovie._id, movieData).subscribe(
          (data) => {
            // Actualiza la lista de películas con la respuesta actualizada
            this.getPeliculas();
            this.movieForm.reset();
            this.selectedMovie = null;
            this.modalTitle = 'Añadir Película';
            this.isEditMode = false; // Cambiar de nuevo al modo de agregado
            Swal.fire('Película actualizada', 'La película ha sido actualizada correctamente', 'success');
          },
          (error) => {
            Swal.fire('Error', 'Hubo un error al actualizar la película', 'error');
          }
        );
      } else {
        // Estás añadiendo, realiza una solicitud POST
        this.enpoints.PeliculasPost(movieData).subscribe(
          (data) => {
            // Actualiza la lista de películas con la respuesta nueva
            this.getPeliculas();
            this.movieForm.reset();
            Swal.fire('Película agregada', 'La película ha sido agregada correctamente', 'success');
          },
          (error) => {
            Swal.fire('Error', 'Hubo un error al añadir la película', 'error');
          }
        );
      }
    }
  }


  getPeliculas(): void {
    this.enpoints.PeliculasGetAll().subscribe(
      (data) => {
        this.movies = data.data; // Asigna la propiedad 'data' de la respuesta a la variable 'movies'
      },
      (error) => {
        console.error('Error al obtener las películas:', error);
      }
    );
  }

  agregarPelicula() {
    if (this.movieForm.valid) {
      const movieData = this.movieForm.value;
      this.enpoints.PeliculasPost(movieData).subscribe(
        (response) => {
          Swal.fire('Película agregada', 'La película ha sido agregada correctamente', 'success');
          this.getPeliculas();
          this.movieForm.reset();
        },
        (error) => {
          Swal.fire('Error', 'Hubo un error al agregar la película', 'error');
        }
      );
    }
  }

  editarPelicula(movie: any) {
    this.selectedMovie = movie;
    this.isEditMode = true;
    this.modalTitle = 'Actualizar Película';
    this.movieForm.patchValue(movie);
  }

  actualizarPelicula() {
    if (this.movieForm.valid && this.selectedMovie) {
      const movieData = this.movieForm.value;
      this.enpoints.PeliculaUpdate(this.selectedMovie._id, movieData).subscribe(
        (response) => {
          Swal.fire('Película actualizada', 'La película ha sido actualizada correctamente', 'success');
          this.getPeliculas();
          this.isEditMode = false;
          this.movieForm.reset();
          this.selectedMovie = null;
          this.modalTitle = 'Añadir Película';
        },
        (error) => {
          Swal.fire('Error', 'Hubo un error al actualizar la película', 'error');
        }
      );
    }
  }

  eliminarPelicula(movieId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.enpoints.PeliculasDeleteById(movieId).subscribe(
          () => {
            Swal.fire('Película eliminada', 'La película ha sido eliminada correctamente', 'success');
            this.getPeliculas();
          },
          (error) => {
            Swal.fire('Error', 'Hubo un error al eliminar la película', 'error');
          }
        );
      }
    });
  }
}



