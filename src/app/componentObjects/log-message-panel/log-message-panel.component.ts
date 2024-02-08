import { Component, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../data-service.service';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-log-message-panel',
  templateUrl: './log-message-panel.component.html',
  styleUrl: './log-message-panel.component.css'
})
export class LogMessagePanelComponent {
  constructor(private dataService: DataService) { };

  @ViewChild('logMessagePanel', { static: true }) logMessagePanel: ElementRef | undefined;

  dataMessage: string = "";
  pathImageName: string = "";

  ngOnInit() {
    this.dataService.messageToLogMessage.subscribe((dataMessage) => {
      this.dataMessage = dataMessage.dataMessage;
      this.pathImageName = dataMessage.pathImageName;

      this.animationMessage(true);

      setTimeout(() => {
        this.animationMessage(false);
      }, 3000);
    });
  }

  animationMessage(isShow: boolean) {
    const logMessagePanel = this.logMessagePanel?.nativeElement;

    if (isShow) {
      anime({
        targets: logMessagePanel,
        translateY: -40,
        duration: 300,
        easing: 'easeInOutQuad',
      });
    } else {
      anime({
        targets: logMessagePanel,
        translateY: 40,
        duration: 300,
        easing: 'easeInOutQuad',
      });
    }
  }
}
