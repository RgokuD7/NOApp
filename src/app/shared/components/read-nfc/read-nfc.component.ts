import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NfcTag, NfcUtils } from '@capawesome-team/capacitor-nfc';
import { ViewDidEnter, ViewWillLeave } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, take } from 'rxjs';
import { NfcService } from 'src/app/services/nfc';
import { PlatformService } from 'src/app/services/platform/platform.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-read-nfc',
  templateUrl: './read-nfc.component.html',
  styleUrls: ['./read-nfc.component.scss'],
})
export class ReadNfcComponent {
  public scannedTag$: Observable<NfcTag>;

  private showLastScannedTag = false;

  constructor(
    private readonly nfcService: NfcService,
    private readonly platformService: PlatformService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.showLastScannedTag =
      this.activatedRoute.snapshot.queryParams['showLastScannedTag'] === 'true';
    this.scannedTag$ = this.showLastScannedTag
      ? this.nfcService.lastScannedTag$
      : this.nfcService.scannedTag$;
  }

  utilSvc = inject(UtilsService);

  public ionViewDidEnter(): void {
    this.nfcService.startScanSession();
    this.subscribeToObservables();
  }

  public ionViewWillLeave(): void {
    this.nfcService.stopScanSession();
  }

  private subscribeToObservables(): void {
    this.scannedTag$.pipe(take(1), untilDestroyed(this)).subscribe((tag) => {
      if (this.platformService.isIos()) {
        this.nfcService.stopScanSession();
      }
      if (tag.id) {
        this.utilSvc.dismissModal({ tag: this.getTagIdHex(tag.id) });
      }
    });
  }

  private getTagIdHex(tagId): string {
    const { hex } = new NfcUtils().convertBytesToHex({
      bytes: tagId,
      start: '',
      separator: ':',
    });
    return hex;
  }
}
