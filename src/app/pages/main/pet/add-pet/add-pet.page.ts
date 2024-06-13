import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavParams } from '@ionic/angular';
import { Pet } from 'src/app/models/pet.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.page.html',
  styleUrls: ['./add-pet.page.scss'],
})
export class AddPetPage implements OnInit {
  constructor() {}

  utilSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  route = inject(ActivatedRoute);
  navParams = inject(NavParams);
  pets = [];
  species: any[];
  pet_gender: any[] = [
    [1, 'Hembra'],
    [2, 'Macho'],
  ];
  add_pet: boolean = false;
  pet: Pet = {} as Pet;
  section = 1;
  edit = false;

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  petForm = new FormGroup({
    id: new FormControl(''),
    uid: new FormControl(this.user().uid),
    specie: new FormControl(''),
    breed: new FormControl(''),
    animal_gender: new FormControl(0),
    names: new FormControl('', [Validators.required]),
    photo: new FormControl('/assets/icon/pet-avatar.png'),
    weight: new FormControl(null),
    height: new FormControl(null),
    size: new FormControl(null),
    birthday: new FormControl(''),
    age: new FormControl(0),
    pet_age: new FormControl(0),
    has_adopted_here: new FormControl(false),
    color: new FormControl(''),
    medical_info: new FormControl(''),
    vaccine_info: new FormControl(''),
    registration_date: new FormControl(new Date().toLocaleString()),
  });

  async ionViewWillEnter() {
    await this.loadData();
    console.log('Pet Name:', this.pet);
  }

  async loadData() {
    await this.getSpecies();
    var user = this.user();
    console.log(user);
    const petId = this.navParams.get('petId');
    await this.getPet(petId);
  }

  ngOnInit() {}

  async takeImage() {
    const dataUrl = (await this.utilSvc.takePicture('Imagen de tu mascota'))
      .dataUrl;
    this.petForm.controls.photo.setValue(dataUrl);
  }

  onSpecieChange(event) {
    this.petForm.controls.specie.setValue(event);
  }

  onGenderChange(event) {
    this.petForm.controls.animal_gender.setValue(event);
  }

  onBirthDayChange(event) {
    this.petForm.controls.birthday.setValue(event.datetime);
    this.petForm.controls.age.setValue(event.age);
  }

  firstSection() {
    this.section++;
  }

  async onSubmit() {
    if (this.petForm.valid) {
      const loading = await this.utilSvc.presentLoading({
        message: 'Guardando',
        keyboardClose: true,
        spinner: 'bubbles',
      });
      await loading.present();

      if (this.petForm.value.photo !== '/assets/icon/pet-avatar.png') {
        let dataUrl = this.petForm.value.photo;
        let imagePath = `${this.petForm.value.uid}/${Date.now()}`;
        let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
        this.petForm.controls.photo.setValue(imageUrl);
      }

      var user = this.user();
      console.log(user);

      delete this.petForm.value.id;

      this.firebaseSvc
        .addDocument('pets', this.petForm.value as Pet)
        .then(async (res) => {
          this.utilSvc.presentToast({
            message: 'Mascota añadida con exito',
            duration: 1500,
            position: 'middle',
            color: 'primary',
          });
          user.pets.push(res.id);
          console.log(user.pets_number < user.pets.length);
          user.pets_number =
            user.pets.length > user.pets_number
              ? user.pets.length
              : user.pets_number;
          console.log(user);
          this.saveUserPet(user.uid, user);
          this.utilSvc.saveInLocalStorage('user', user);
          this.utilSvc.routerLink('/main/pet');
        })
        .catch((err) => {
          this.utilSvc.presentToast({
            message: 'Error al guardar información de mascota',
            duration: 1500,
            position: 'middle',
            color: 'danger',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async getSpecies() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.firebaseSvc.getCollectionData('species/').subscribe({
        next: (data: any) => {
          this.species = data.map((item) => [item.id, item.specie]);
          sub.unsubscribe();
          resolve();
        },
        error: (error) => {
          console.log(error);
          reject(error);
        },
      });
    });
  }

  async getPet(petId: string) {
    let path = `pets/${petId}`;
    this.firebaseSvc
      .getDocument(path)
      .then((pet: Pet) => {
        console.log(pet);
        this.pet = pet;
        this.edit = true;
        this.updatePetForm();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updatePetForm() {
    this.petForm.patchValue({
      id: this.pet.id || '',
      specie: this.pet.specie || '',
      breed: this.pet.breed || '',
      animal_gender: this.pet.animal_gender || 0,
      names: this.pet.names || '',
      photo: this.pet.photo || '/assets/icon/pet-avatar.png',
      weight: this.pet.weight || null,
      height: this.pet.height || null,
      size: this.pet.size || null,
      birthday: this.pet.birthday || '',
      age: this.pet.age || 0,
      pet_age: this.pet.pet_age || 0,
      has_adopted_here: this.pet.has_adopted_here || false,
      color: this.pet.color || '',
      medical_info: this.pet.medical_info || '',
      vaccine_info: this.pet.vaccine_info || '',
      registration_date:
        this.pet.registration_date || new Date().toLocaleString(),
    });
  }

  async saveUserPet(uid: string, user: User) {
    let path = `users/${uid}`;
    this.firebaseSvc
      .setDocument(path, user)
      .then(() => {
        this.utilSvc.presentToast({
          message: 'Información guardada con exito',
          duration: 1500,
          position: 'middle',
          color: 'primary',
        });
      })
      .catch((error) => {
        console.log(error);
        this.utilSvc.presentToast({
          message: 'Error al guardar información de mascota',
          duration: 1500,
          position: 'middle',
          color: 'danger',
        });
      });
  }
}
