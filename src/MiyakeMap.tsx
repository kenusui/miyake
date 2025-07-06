import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  Timeline,
  TimelineSeparator,
  TimelineItem,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import {
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Box,
} from "@mui/material";
import { useRef, useState } from "react";
import { Marker as LeafletMarker, Map } from "leaflet";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { dateSections, miyakeCenter } from "./ryotei";

import L from "leaflet";
import { DefaultIcon, GreenIcon, RedIcon } from "./icons";

L.Marker.prototype.options.icon = DefaultIcon;

// sectionIdx, idx からグローバルなマーカーインデックスを取得する関数
function getFlatMarkerIndex(sectionIdx: number, idx: number): number {
  return (
    dateSections
      .slice(0, sectionIdx)
      .reduce((acc, s) => acc + s.items.filter((i) => i.position).length, 0) +
    dateSections[sectionIdx].items.slice(0, idx).filter((i) => i.position)
      .length
  );
}

export default function MiyakeMap() {
  const markerRefs = useRef<(LeafletMarker | null)[]>([]);
  const mapRef = useRef<Map | null>(null);
  // 日付ごとのマーカー表示状態
  const [visibleDates, setVisibleDates] = useState<string[]>([]);
  const [openedMarkerIdx, setOpenedMarkerIdx] = useState<number | null>(null);

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      width="100%"
      sx={{ minHeight: "100vh" }}
    >
      <Grid
        size={{ xs: 12, md: 7 }}
        sx={{
          position: "sticky",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 900 }}>
          <MapContainer
            center={miyakeCenter}
            zoom={12}
            style={{ height: "600px", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {dateSections.map((section, sectionIdx) =>
              visibleDates.includes(section.date)
                ? section.items.map((item, idx) => {
                    if (!item.position) return null;
                    const flatIdx = getFlatMarkerIndex(sectionIdx, idx);
                    // 次の目的地アイコンの色を決定
                    let icon = DefaultIcon;
                    const isMarkerOpened =
                      openedMarkerIdx !== null && flatIdx === openedMarkerIdx;
                    const isPrevMarkerOpened =
                      openedMarkerIdx !== null &&
                      flatIdx === openedMarkerIdx + 1;
                    if (isMarkerOpened) {
                      icon = RedIcon;
                    } else if (isPrevMarkerOpened) {
                      icon = GreenIcon;
                    }
                    return (
                      <Marker
                        key={`${section.date}-${idx}`}
                        position={item.position}
                        icon={icon}
                        ref={(ref) => {
                          markerRefs.current[flatIdx] =
                            ref && "openPopup" in ref ? ref : null;
                        }}
                        eventHandlers={{
                          popupopen: () => setOpenedMarkerIdx(flatIdx),
                          popupclose: () => setOpenedMarkerIdx(null),
                        }}
                      >
                        <Popup>
                          <b>{item.time}</b> {item.label}
                        </Popup>
                      </Marker>
                    );
                  })
                : null
            )}
          </MapContainer>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="h6" gutterBottom>
          タイムライン
        </Typography>
        {dateSections.map((section, sectionIdx) => (
          <Accordion
            key={section.date}
            defaultExpanded={false}
            onChange={(_, expanded) => {
              setVisibleDates((prev) =>
                expanded
                  ? [...prev, section.date]
                  : prev.filter((d) => d !== section.date)
              );
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" color="primary">
                {section.date}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack sx={{ justifyContent: "flex-start" }}>
                <Timeline
                  position="right"
                  sx={{
                    mt: 0,
                    mb: 0,
                    pt: 0,
                    pb: 0,
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 0.2,
                    },
                  }}
                >
                  {section.items.map((item, idx) => {
                    const flatIdx = getFlatMarkerIndex(sectionIdx, idx);
                    const markerIdx = item.position ? flatIdx : -1;
                    const hasMarker =
                      markerIdx !== -1 && visibleDates.includes(section.date);
                    return (
                      <TimelineItem key={idx}>
                        <TimelineOppositeContent>
                          <Typography variant="body2">{item.time}</Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot color="primary" />
                          {idx < section.items.length - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography
                            variant="body1"
                            sx={{
                              cursor: hasMarker ? "pointer" : "default",
                              textDecoration: hasMarker ? "underline" : "none",
                            }}
                            onClick={() => {
                              if (hasMarker && markerRefs.current[markerIdx]) {
                                const marker = markerRefs.current[markerIdx];
                                const map = mapRef.current;
                                if (marker && map) {
                                  const { lat, lng } = marker.getLatLng();
                                  map.flyTo([lat, lng], 15);
                                  marker.openPopup();
                                  setOpenedMarkerIdx(markerIdx); // ポップアップを開いたマーカーidxを記録
                                }
                              }
                            }}
                          >
                            {item.label}
                          </Typography>
                          {item.info && (
                            <Accordion
                              defaultExpanded={false}
                              sx={{ boxShadow: "none" }}
                            >
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  詳細
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>{item.info}</AccordionDetails>
                            </Accordion>
                          )}
                        </TimelineContent>
                      </TimelineItem>
                    );
                  })}
                </Timeline>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
    </Grid>
  );
}
