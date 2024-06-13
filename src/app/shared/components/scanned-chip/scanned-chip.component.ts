import { Component, inject, Input, OnInit } from '@angular/core';
import { Pet } from 'src/app/models/pet.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-scanned-chip',
  templateUrl: './scanned-chip.component.html',
  styleUrls: ['./scanned-chip.component.scss'],
})
export class ScannedChipComponent implements OnInit {
  @Input() chipid: string;
  @Input() isRegistering: boolean = false;
  @Input() isSame: boolean = false;

  exist: boolean = false;
  isOwner: boolean = false;
  show: string = '';
  button: string = '';

  utilSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  checked_chip = {
    petid: '',
    uid: '',
  };

  pet: Pet;
  owner: User;
  valid: boolean = false;
  species: string[] = [];

  constructor() {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.checkChip(this.chipid);
    this.exist = this.checked_chip.petid ? true : false;
    this.isOwner = this.checked_chip.uid == this.user().uid ? true : false;
    if (!this.isSame) {
      if (!this.exist) {
        this.show = this.isRegistering ? 'valid' : 'not-found';
        this.button = this.isRegistering ? 'valid' : 'invalid';
      } else {
        await this.getOwner(this.checked_chip.uid);
        await this.getPet(this.checked_chip.petid);
        let ownerId = this.checked_chip.uid ? this.checked_chip.uid : '';
        if (ownerId != this.user().uid) {
          this.show = this.isRegistering ? 'not-owner' : 'show';
          this.button = this.isRegistering ? 'show-info' : 'valid';
        } else {
          this.show = this.isRegistering ? 'owner' : 'show';
          this.button = this.isRegistering ? 'warning' : 'valid';
        }
      }
    } else {
      await this.getPet(this.checked_chip.petid);
      this.show = 'same';
      this.button = 'warning';
    }
    console.log(this.chipid);
    console.log(this.pet);
    console.log(this.checked_chip);
    console.log(this.owner);
    console.log(this.isOwner);
    console.log(this.valid);
    console.log(this.exist);
    console.log(this.isRegistering);
    console.log(this.isSame);
  }

  showInfo() {
    this.show = 'show';
    this.button = 'acept';
  }

  async checkChip(tagId) {
    let path = `chips/${tagId}`;
    await this.firebaseSvc
      .getDocument(path)
      .then((tag: any) => {
        this.checked_chip.petid = tag.petid;
        this.checked_chip.uid = tag.uid;
      })
      .catch((error) => {
        console.error(error);
      });
  }
  async getPet(petid) {
    let path = `pets/${petid}`;
    await this.firebaseSvc
      .getDocument(path)
      .then((pet: Pet) => {
        this.pet = pet;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async getOwner(uid) {
    let path = `users/${uid}`;
    await this.firebaseSvc
      .getDocument(path)
      .then((user: User) => {
        this.owner = user;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async getSpecies() {
    return new Promise<void>((resolve, reject) => {
      let sub = this.firebaseSvc.getCollectionData('species/').subscribe({
        next: (data: any) => {
          this.species = data.map((item) => [item.id, item.specie]);
          console.log(this.species);
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

  getSpecieName(specieId: string): string {
    const specie = this.species.find((s) => s[0] === specieId);
    return specie ? specie[1] : '';
  }
}
