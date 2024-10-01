declare namespace H {
  namespace map {
    class Marker {
      constructor(geo: { lat: number; lng: number }, options?: any);
      getGeometry(): { lat: number; lng: number };
    }
  }

  namespace ui {
    class InfoBubble {
      constructor(
        geometry: { lat: number; lng: number },
        options: { content: string }
      );
    }
  }

  namespace service {
    class Platform {
      constructor(options: { apikey: string });
      createDefaultLayers(): any;
    }
  }
}
