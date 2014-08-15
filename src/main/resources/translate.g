/* Translate the graph so the lower-left point of the bounding box is at the
origin.
 * We rely on bounding box being set.
 */
BEGIN {
  double llx, lly, urx, ury;
  double x, y;
  int cnt, sz;

  char* transE (char* p) {
    char* newpos = "";
    cnt = sscanf (p, "e,%lf,%lf%n", &x, &y, &sz);
    if (cnt == 2) {
      newpos = newpos + sprintf ("e%lf,%lf ", x-llx, y-lly);
      p = substr(p, sz);
    }
    cnt = sscanf (p, "s,%lf,%lf%n", &x, &y, &sz);
    if (cnt == 2) {
      newpos = newpos + sprintf ("s%lf,%lf ", x-llx, y-lly);
      p = substr(p, sz);
    }

    while (sscanf (p, "%lf,%lf%n", &x, &y, &sz) == 2) {
      newpos = newpos + sprintf ("%lf,%lf ", x-llx, y-lly);
      p = substr(p, sz);
    }

    return newpos;
  }
}
BEG_G {
  sscanf($.bb, "%f,%f,%f,%f", &llx, &lly, &urx, &ury);
  $.bb = sprintf ("0,0,%.05f,%.05f", urx-llx, ury-lly);
}
N {
    sscanf ($.pos, "%f,%f", &x, &y);
    $.pos = sprintf ("%f,%f", x-llx, y-lly);
}
E {
  $.pos = transE($.pos);
}
