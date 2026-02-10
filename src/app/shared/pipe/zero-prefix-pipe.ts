import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroPrefix',
  standalone: true
})
export class ZeroPrefixPipe implements PipeTransform {

  transform(value: number | string): string {
    const num = Number(value);
    return num < 10 ? `0${num}` : `${num}`;
  }

}
