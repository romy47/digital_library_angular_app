
import { Component, Input, OnChanges } from "@angular/core";

@Component({
  selector: 'title-highlight',
  template: `
        <ng-container *ngFor="let match of result">
            <span class='xxggxxqqxxss' *ngIf="isMatch(match); else nomatch">{{match}} </span>
            <ng-template #nomatch>{{match}} </ng-template>
        </ng-container>
    `,
})
export class TitleHighlightComponent implements OnChanges {
  @Input() needle: string = '';
  @Input() needles: string[] = [];
  @Input() haystack: string;
  public result: string[];


  ngOnChanges() {
    this.result = this.haystack.split(' ');

  }

  isMatch(value: string) {
    let match = false;
    for (let i = 0; i < this.needles.length; i++) {
      // (value == 'AI:') ? console.log('-----------------    AI     --------------', value) : '';
      value = value.replace(/^[^\w]+/, "");
      value = value.replace(/[^\w]+$/, "");
      // (value == 'AI:') ? console.log('-----------------    AI 2     --------------', value) : '';

      var reg = "^(" + this.needles[i] + ")$";
      var regex = new RegExp(reg, "i");
      if (value.match(regex)) {
        match = true;
        break;
      }
    }

    return match;
  }
}
