import { inject, Injectable } from '@angular/core';
import {
  NdefMessage,
  NfcTag,
  NfcTagTechType,
} from '@capawesome-team/capacitor-nfc';
import { Observable } from 'rxjs';
import { CapacitorNfcService } from '../../capacitor';
import { PlatformService } from '../../platform/platform.service';
import { UtilsService } from '../../utils.service';

@Injectable({
  providedIn: 'root',
})
export class NfcService {
  constructor(private readonly capacitorNfcService: CapacitorNfcService) {}

  platformService = inject(PlatformService);
  utilSvc = inject(UtilsService);

  public get scannedTag$(): Observable<NfcTag> {
    return this.capacitorNfcService.scannedTag$;
  }

  public get lastScannedTag$(): Observable<NfcTag> {
    return this.capacitorNfcService.lastScannedTag$;
  }

  public async startScanSession(): Promise<void> {
    const isSupported = await this.isSupported();
    if (!isSupported) {
      this.createNotSupportedError();
    }
    const isEnabled = await this.isEnabled();
    if (!isEnabled) {
      this.createNotEnabledError();
    }
    await this.capacitorNfcService.startScanSession();
  }

  public async stopScanSession(): Promise<void> {
    const isSupported = await this.isSupported();
    if (!isSupported) {
      return;
    }
    const isEnabled = await this.isEnabled();
    if (!isEnabled) {
      return;
    }
    await this.capacitorNfcService.stopScanSession();
  }

  public async write(message: NdefMessage): Promise<void> {
    const isSupported = await this.isSupported();
    if (!isSupported) {
      this.createNotSupportedError();
    }
    const isEnabled = await this.isEnabled();
    if (!isEnabled) {
      this.createNotEnabledError();
    }
    await this.capacitorNfcService.write({
      message,
    });
  }

  public async erase(): Promise<void> {
    const isSupported = await this.isSupported();
    if (!isSupported) {
      this.createNotSupportedError();
    }
    const isEnabled = await this.isEnabled();
    if (!isEnabled) {
      this.createNotEnabledError();
    }
    await this.capacitorNfcService.erase();
  }

  public async format(): Promise<void> {
    const isSupported = await this.isSupported();
    if (!isSupported) {
      this.createNotSupportedError();
    }
    const isEnabled = await this.isEnabled();
    if (!isEnabled) {
      this.createNotEnabledError();
    }
    await this.capacitorNfcService.format();
  }

  public async transceive(
    techType: NfcTagTechType,
    data: number[]
  ): Promise<number[]> {
    const isSupported = await this.isSupported();
    if (!isSupported) {
      this.createNotSupportedError();
    }
    const isEnabled = await this.isEnabled();
    if (!isEnabled) {
      this.createNotEnabledError();
    }
    const { response } = await this.capacitorNfcService.transceive({
      techType,
      data,
    });
    return response;
  }

  public isSupported(): Promise<boolean> {
    return this.capacitorNfcService.isSupported();
  }

  public isEnabled(): Promise<boolean> {
    return this.capacitorNfcService.isEnabled();
  }

  private createNotSupportedError(): Error {
    let message = [
      'Tú navegador no soporta NFC en este dispositivo',
      'Por favor utiliza un disositivo Android o iOS',
    ].join(' ');
    const isNativePlatform = this.platformService.isNativePlatform();
    if (isNativePlatform) {
      message = 'Tú dispositivo no tiene NFC';
    }
    this.utilSvc.dismissModal({ error: message });
    /* setTimeout(() => {
      this.utilSvc.dismissModal({ tag: '33:35:CE:F9' });
    }, 1000); */
    return new Error(message);
  }

  private createNotEnabledError(): Error {
    const message = 'Por favor activa el NFC en tu dispositivo';
    this.utilSvc.dismissModal({ error: message });
    return new Error(message);
  }
}
